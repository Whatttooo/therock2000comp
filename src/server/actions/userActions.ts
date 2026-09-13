"use server";

import { db } from "@/db";
import { countdownResults, songs, votes, users } from "@/db/schema";
import { SpotifySearchResult } from "@/lib/spotify";
import { eq, and, inArray } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { buildPlayedSongIndex } from "./actions";
import { getLeaderboard } from "./leaderboardActions";
import { playedSongIndexKey } from "@/lib/utils";
import { computeSongPoints } from "@/lib/scoring";

export type UserVoteWithStatus = {
  id: string;
  title: string;
  artist: string;
  albumArt: string | null;
  position: number | null;
  points: number;
  isTopPick: boolean;
};

/**
 * A single user's votes for a given year, joined with the song details and
 * (if the song has aired) its broadcast position, with points computed via
 * the same scoring rule the leaderboard uses.
 */
export const getUserVotesWithStatus = async (
  userId: string,
  year: number,
): Promise<UserVoteWithStatus[]> => {
  const rows = await db
    .select({
      id: songs.id,
      title: songs.title,
      artist: songs.artist,
      albumArt: songs.albumArt,
      isTopPick: votes.isTopPick,
      position: countdownResults.position,
    })
    .from(votes)
    .innerJoin(songs, eq(votes.songId, songs.id))
    .leftJoin(
      countdownResults,
      and(
        eq(countdownResults.songId, votes.songId),
        eq(countdownResults.countdownYear, year),
      ),
    )
    .where(and(eq(votes.userId, userId), eq(votes.voteYear, year)));

  const played = rows.filter(
    (row): row is typeof row & { position: number } => row.position !== null,
  );
  const bestPosition =
    played.length > 0 ? Math.min(...played.map((row) => row.position)) : null;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    albumArt: row.albumArt,
    position: row.position,
    isTopPick: row.isTopPick,
    points: computeSongPoints(
      { isTopPick: row.isTopPick, position: row.position },
      bestPosition,
    ),
  }));
};

export type UserProfileStats = {
  leaderboardRank: number | null;
  totalPoints: number;
  songsPlayedCount: number;
  totalSongsVoted: number;
  topPick: {
    id: string;
    title: string;
    artist: string;
    albumArt: string | null;
    outcome: "worked" | "didnt-work" | "pending";
  } | null;
};

/**
 * Look up a user by id for the public profile page. Returns null (not an
 * error) when the id doesn't exist, so the page can render a plain
 * not-found state.
 */
export const getUserById = async (
  userId: string,
): Promise<{ id: string; name: string; image: string | null } | null> => {
  const [row] = await db
    .select({ id: users.id, name: users.name, image: users.image })
    .from(users)
    .where(eq(users.id, userId));
  return row ?? null;
};

/**
 * Summary stats for a user's profile/dashboard: leaderboard rank, total
 * points, how many of their picks have aired, and how their declared top
 * pick played out. Takes the caller's already-fetched
 * `getUserVotesWithStatus` result rather than re-querying it.
 */
export const getUserProfileStats = async (
  userId: string,
  year: number,
  userVotesWithStatus: UserVoteWithStatus[],
): Promise<UserProfileStats> => {
  const leaderboard = await getLeaderboard(year);
  const rankIndex = leaderboard.findIndex((entry) => entry.id === userId);

  const topPickRow = userVotesWithStatus.find((row) => row.isTopPick) ?? null;

  return {
    leaderboardRank: rankIndex === -1 ? null : rankIndex + 1,
    totalPoints: userVotesWithStatus.reduce((sum, row) => sum + row.points, 0),
    songsPlayedCount: userVotesWithStatus.filter((row) => row.position !== null)
      .length,
    totalSongsVoted: userVotesWithStatus.length,
    topPick: topPickRow
      ? {
          id: topPickRow.id,
          title: topPickRow.title,
          artist: topPickRow.artist,
          albumArt: topPickRow.albumArt,
          outcome:
            topPickRow.position === null
              ? "pending"
              : topPickRow.points > 0
                ? "worked"
                : "didnt-work",
        }
      : null,
  };
};

export const submitUserVotes = async (
  spotifySongs: SpotifySearchResult[],
  currentYear: number,
  topPickSpotifyId: string | null,
): Promise<{ success: boolean; error?: string }> => {
  // The caller's identity comes from the actual session, never from a
  // client-supplied argument — a server action is directly callable from
  // the browser regardless of which page rendered it, so a `userId`
  // parameter here would let anyone submit a ballot as any other user.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return {
      success: false,
      error: "You must be signed in to submit votes.",
    };
  }
  const userId = session.user.id;

  const votesExist = await db
    .select()
    .from(votes)
    .where(and(eq(votes.userId, userId), eq(votes.voteYear, currentYear)));
  if (votesExist.length > 0) {
    return {
      success: false,
      error: "User has already submitted votes for the current year.",
    };
  }

  try {
    // Built once, outside the loop: each song would otherwise rescan and
    // re-normalize the whole ~2000-entry feed on every one of up to 20
    // per-ballot lookups.
    const playedSongIndex = await buildPlayedSongIndex();

    // The DB client is neon-http (a stateless HTTP connection, chosen so
    // this app works cleanly on Vercel's serverless functions), which has
    // no session/transaction support (`db.transaction()` throws). Its
    // atomic alternative is `db.batch()` — but that sends a fixed array of
    // pre-built queries in one shot, so every song's `songs.id` must be
    // known BEFORE building any insert, rather than read back mid-loop as
    // the previous transaction-based version did.

    // De-duplicate songs by spotifyId, keeping only the first occurrence.
    // This prevents issues where duplicate entries in the input would each
    // get their own UUID on insert, causing foreign key violations when
    // the second entry references a non-existent songs.id.
    const seenSpotifyIds = new Set<string>();
    const dedupedSongs = spotifySongs.filter((song) => {
      if (seenSpotifyIds.has(song.spotifyId)) return false;
      seenSpotifyIds.add(song.spotifyId);
      return true;
    });

    const spotifyIds = dedupedSongs.map((song) => song.spotifyId);
    const existingSongs = spotifyIds.length
      ? await db
          .select({ id: songs.id, spotifyId: songs.spotifyId })
          .from(songs)
          .where(inArray(songs.spotifyId, spotifyIds))
      : [];
    const existingSongIdBySpotifyId = new Map(
      existingSongs.map((row) => [row.spotifyId, row.id]),
    );

    const songEntries = dedupedSongs.map((spotifySong) => {
      const playedSong = playedSongIndex.get(
        playedSongIndexKey(spotifySong.title, spotifySong.artist),
      );
      const playedSongRank = playedSong
        ? parseInt(playedSong.rank, 10)
        : null;
      const album = playedSong?.album || null;
      const parsedReleaseYear = playedSong?.albumYear
        ? parseInt(playedSong.albumYear, 10)
        : null;
      const releaseYear =
        parsedReleaseYear !== null && !Number.isNaN(parsedReleaseYear)
          ? parsedReleaseYear
          : null;
      // Reuse the existing row's id so it round-trips through
      // onConflictDoUpdate unchanged; only songs not already in the table
      // need a freshly generated one.
      const songId =
        existingSongIdBySpotifyId.get(spotifySong.spotifyId) ?? randomUUID();

      return { spotifySong, playedSongRank, album, releaseYear, songId };
    });

    // A. Upsert every song into the global master song directory pool.
    // album/releaseYear are only included when a value is actually
    // available, so a song with no feed match today doesn't clobber a
    // previously-cached value with null on conflict.
    const songInserts = songEntries.map(
      ({ spotifySong, album, releaseYear, songId }) =>
        db
          .insert(songs)
          .values({
            id: songId,
            spotifyId: spotifySong.spotifyId,
            title: spotifySong.title,
            artist: spotifySong.artist,
            albumArt: spotifySong.albumArt || null,
            ...(album ? { album } : {}),
            ...(releaseYear ? { releaseYear } : {}),
          })
          .onConflictDoUpdate({
            target: songs.spotifyId,
            set: {
              title: spotifySong.title,
              artist: spotifySong.artist,
              albumArt: spotifySong.albumArt,
              ...(album ? { album } : {}),
              ...(releaseYear ? { releaseYear } : {}),
            },
          }),
    );

    const countdownResultInserts = songEntries
      .filter(
        (entry): entry is typeof entry & { playedSongRank: number } =>
          !!entry.playedSongRank,
      )
      .map(({ songId, playedSongRank }) =>
        db
          .insert(countdownResults)
          .values({
            songId,
            position: playedSongRank,
            countdownYear: currentYear,
          })
          .onConflictDoNothing(),
      );

    const voteInserts = songEntries.map(({ spotifySong, songId }) =>
      db.insert(votes).values({
        userId,
        songId,
        voteYear: currentYear,
        isTopPick: spotifySong.spotifyId === topPickSpotifyId,
      }),
    );

    const allInserts = [
      ...songInserts,
      ...countdownResultInserts,
      ...voteInserts,
    ];
    const [firstInsert, ...restInserts] = allInserts;
    if (!firstInsert) {
      return { success: false, error: "No songs to submit." };
    }
    await db.batch([firstInsert, ...restInserts]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit user votes." };
  }
};
