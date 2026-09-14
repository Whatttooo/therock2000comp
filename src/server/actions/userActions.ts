"use server";

import { db } from "@/db";
import { countdownResults, songs, votes, users } from "@/db/schema";
import { SongSearchResult } from "./searchActions";
import { eq, and } from "drizzle-orm/sql/expressions/conditions";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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
  spotifySongs: SongSearchResult[],
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
    const playedSongIndex = await buildPlayedSongIndex();

    const seenSpotifyIds = new Set<string>();
    const dedupedSongs = spotifySongs.filter((song) => {
      if (seenSpotifyIds.has(song.spotifyId)) return false;
      seenSpotifyIds.add(song.spotifyId);
      return true;
    });

    const songMeta = dedupedSongs.map((spotifySong) => {
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
      return { spotifySong, playedSongRank, album, releaseYear };
    });

    if (songMeta.length === 0) {
      return { success: false, error: "No songs to submit." };
    }

    // Upsert songs first and read back the real id via .returning() —
    // avoids a race where two concurrent submitters guess different ids
    // for the same brand-new song.
    const songInserts = songMeta.map(({ spotifySong, album, releaseYear }) =>
      db
        .insert(songs)
        .values({
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
        })
        .returning({ id: songs.id, spotifyId: songs.spotifyId }),
    );
    const [firstSongInsert, ...restSongInserts] = songInserts;
    const songInsertResults = await db.batch([
      firstSongInsert,
      ...restSongInserts,
    ]);

    const songIdBySpotifyId = new Map<string, string>();
    for (const rows of songInsertResults) {
      songIdBySpotifyId.set(rows[0].spotifyId, rows[0].id);
    }

    const countdownResultInserts = songMeta
      .filter(
        (entry): entry is typeof entry & { playedSongRank: number } =>
          !!entry.playedSongRank,
      )
      .map(({ spotifySong, playedSongRank }) =>
        db
          .insert(countdownResults)
          .values({
            songId: songIdBySpotifyId.get(spotifySong.spotifyId)!,
            position: playedSongRank,
            countdownYear: currentYear,
          })
          .onConflictDoNothing(),
      );

    const voteInserts = songMeta.map(({ spotifySong }) =>
      db.insert(votes).values({
        userId,
        songId: songIdBySpotifyId.get(spotifySong.spotifyId)!,
        voteYear: currentYear,
        isTopPick: spotifySong.spotifyId === topPickSpotifyId,
      }),
    );

    const allInserts = [...countdownResultInserts, ...voteInserts];
    const [firstInsert, ...restInserts] = allInserts;
    await db.batch([firstInsert, ...restInserts]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to submit user votes." };
  }
};
