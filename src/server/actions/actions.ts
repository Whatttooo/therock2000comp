"use server";
import type { Song } from "@/data/rock2000songs";
import { rock2000songs } from "@/data/rock2000songs";
import {
  getNumberOfSongsPlayed,
  getSongFromPlayedSong,
  getUserPoints,
} from "./actionUtils";
import { db } from "@/db";
import { songs, countdownResults, votes } from "@/db/schema";
import { eq, and } from "drizzle-orm/sql/expressions/conditions";
import { playedSongIndexKey } from "@/lib/utils";
import { getSpotifyTrackFromTitleAndArtist } from "@/lib/spotify";
import { notFound } from "next/navigation";

const rock2000PlayedEndpoint =
  "https://radio-api.mediaworks.nz/comp-api/v1/countdown/therock";

// Plain typos in the feed's own title text (as opposed to KNOWN_ALIASES in
// lib/utils.ts, which corrects spelling *differences* between an otherwise
// correct feed title and Spotify's canonical one). These block an exact
// Spotify match outright, so they're corrected here, before the feed data
// reaches either the strict Spotify lookup or the DB match index, rather
// than inside normalizeSongTitle (which only helps two already-seeded rows
// match each other, and lowercases its input, losing the casing a strict
// Spotify query needs).
//
// Scoped to (title, artist) pairs rather than title alone: several of these
// corrected titles are common enough words/phrases ("Rockit", "Road Trip")
// that a different artist could legitimately have a song with that exact
// title, so an artist-blind correction risks mangling an unrelated song.
const KNOWN_FEED_TITLE_TYPOS: {
  title: RegExp;
  artist: RegExp;
  correctedTitle: string;
}[] = [
  { title: /\bjack and dianne\b/i, artist: /mellencamp/i, correctedTitle: "Jack and Diane" },
  { title: /^rockit$/i, artist: /def leppard/i, correctedTitle: "Rocket" },
  { title: /^everyday.s a saturday$/i, artist: /elemeno p/i, correctedTitle: "Every Day's A Saturday" },
  { title: /^magdelena$/i, artist: /a perfect circle/i, correctedTitle: "Magdalena" },
  { title: /^road trip$/i, artist: /steriogram/i, correctedTitle: "Roadtrip" },
  { title: /^roots radicals$/i, artist: /rancid/i, correctedTitle: "Roots Radical" },
  { title: /^running with the devil$/i, artist: /van halen/i, correctedTitle: "Runnin' With The Devil" },
  { title: /^d\.?o\.?a\.?$/i, artist: /foo fighters/i, correctedTitle: "DOA" },
];

function correctKnownFeedTitleTypos(title: string, artist: string): string {
  const match = KNOWN_FEED_TITLE_TYPOS.find(
    (entry) => entry.title.test(title) && entry.artist.test(artist),
  );
  return match ? match.correctedTitle : title;
}

// The feed censors profanity with asterisks (e.g. "Unf**k The World"),
// Spotify's own catalog titles don't. Safe as a blind, artist-unscoped
// substitution: "f**k" only ever appears in the feed as this censorship,
// never as a legitimate title fragment on its own.
function desensorFeedProfanity(title: string): string {
  return title.replace(/f\*\*k/gi, (match) => (match[0] === "F" ? "Fuck" : "fuck"));
}

// A row from the `songs` table, the DB-backed shape used by getSongDetail.
// Named "SongRecord" (rather than "Song") to avoid clashing with the
// legacy `Song` type imported above from `@/data/rock2000songs`.
export type SongRecord = {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  albumArt: string | null;
  album: string | null;
  releaseYear: number | null;
};

export type SongDetail =
  | { status: "not-played"; song: SongRecord }
  | {
      status: "played";
      song: SongRecord;
      rank: number;
      rankOneYearAgo: string;
      rankTwoYearsAgo: string;
    }
  | { status: "unresolved"; title: string; artist: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const toSongRecord = (row: typeof songs.$inferSelect): SongRecord => ({
  id: row.id,
  spotifyId: row.spotifyId,
  title: row.title,
  artist: row.artist,
  albumArt: row.albumArt,
  album: row.album,
  releaseYear: row.releaseYear,
});

export type PlayedSong = {
  rank: string;
  title: string;
  album: string;
  artist: string;
  albumYear: string;
  rankOneYearAgo: string;
  rankTwoYearsAgo: string;
  timestamp: string;
  albumArt: string;
};

/**
 * Retrieves the current song from the server.
 *
 * @returns {Promise<Song>} A promise that resolves to the current song.
 * @throws {Error} If the song is not found.
 */
export const getCurrentSong = async (): Promise<Song> => {
  const playedSong = await getCurrentPlayedSong();
  const song = getSongFromPlayedSong(playedSong);
  if (!song) {
    throw new Error("Song not found");
  }
  return song;
};

/**
 * Retrieves the current played song from the server.
 *
 * @returns {Promise<PlayedSong>} A promise that resolves to the current played song.
 * @throws {Error} If there is an error fetching the song.
 */
export const getCurrentPlayedSong = async (): Promise<PlayedSong> => {
  try {
    const allPlayedSongs = await getAllPlayedSongs();
    return allPlayedSongs[0];
  } catch (error) {
    throw new Error("error fetching song");
  }
};

/**
 * Retrieves all played songs.
 * @returns {Promise<PlayedSong[]>} A promise that resolves to an array of PlayedSong objects.
 * @throws {Error} If there is an error fetching the songs.
 */
export const getAllPlayedSongs = async (): Promise<PlayedSong[]> => {
  try {
    const response = await fetch(rock2000PlayedEndpoint, {
      next: { revalidate: 300 },
    });
    const data: PlayedSong[] = await response.json();
    return data.map((song) => ({
      ...song,
      title: desensorFeedProfanity(
        correctKnownFeedTitleTypos(song.title, song.artist),
      ),
    }));
  } catch (error) {
    throw new Error("error fetching all songs");
  }
};

/**
 * Indexes the MediaWorks feed by normalized title+artist. Callers doing more
 * than one lookup against the feed (e.g. resolving a whole ballot) should
 * build this once and look up by key, instead of calling
 * `findPlayedSongByTitleArtist` per song and rescanning the ~2000-entry feed
 * each time.
 */
export const buildPlayedSongIndex = async (): Promise<
  Map<string, PlayedSong>
> => {
  const allPlayedSongs = await getAllPlayedSongs();
  const index = new Map<string, PlayedSong>();
  for (const playedSong of allPlayedSongs) {
    index.set(
      playedSongIndexKey(playedSong.title, playedSong.artist),
      playedSong,
    );
  }
  return index;
};

/**
 * Finds a played song from the MediaWorks feed by title+artist. For a
 * single lookup; see `buildPlayedSongIndex` for repeated lookups.
 */
export const findPlayedSongByTitleArtist = async (
  title: string,
  artist: string,
): Promise<PlayedSong | undefined> => {
  const index = await buildPlayedSongIndex();
  return index.get(playedSongIndexKey(title, artist));
};

/**
 * Finds a played song from the MediaWorks feed by its broadcast rank.
 */
export const findPlayedSongByRank = async (
  rank: number,
): Promise<PlayedSong | undefined> => {
  const allPlayedSongs = await getAllPlayedSongs();
  return allPlayedSongs.find((song) => parseInt(song.rank) === rank);
};

/**
 * Finds a `songs` DB row that corresponds to a MediaWorks feed entry, by
 * normalized title+artist match (the same technique used the other
 * direction in `findPlayedSongByTitleArtist`). Needed because a `songs`
 * row is keyed on Spotify data, so there is no direct FK from a feed rank
 * to it.
 */
/**
 * Indexes the `songs` table by normalized title+artist. Callers doing more
 * than one lookup against it (e.g. rendering the whole played-songs list)
 * should build this once and look up by key, instead of calling
 * `findSongRecordByTitleArtist` per row and re-querying the table each time.
 */
export const buildSongRecordIndex = async (): Promise<
  Map<string, typeof songs.$inferSelect>
> => {
  const allSongs = await db.select().from(songs);
  const index = new Map<string, typeof songs.$inferSelect>();
  for (const songRow of allSongs) {
    index.set(playedSongIndexKey(songRow.title, songRow.artist), songRow);
  }
  return index;
};

const findSongRecordByTitleArtist = async (
  title: string,
  artist: string,
): Promise<typeof songs.$inferSelect | undefined> => {
  const index = await buildSongRecordIndex();
  return index.get(playedSongIndexKey(title, artist));
};

export const getSongPlayedCount = async (): Promise<number> => {
  const allPlayedSongs = await getAllPlayedSongs();
  return allPlayedSongs.length;
};

export const buildHomePageSongChartData = async () => {
  const playedSongsCount = await getSongPlayedCount();
  const percentOfComp = (playedSongsCount / 2000) * 100;
  const percentBackToCircle = (percentOfComp / 100) * 360 + 90;
  return { playedSongsCount, percentBackToCircle };
};

/**
 * Total number of ballot entries cast this year, across every user (a user
 * with a full ballot contributes 20). Used for the homepage "total votes"
 * stat.
 */
export const getTotalVoteCount = async (year: number): Promise<number> => {
  const rows = await db
    .select({ id: votes.id })
    .from(votes)
    .where(eq(votes.voteYear, year));
  return rows.length;
};

export const getSongByRank = async (rank: number): Promise<PlayedSong> => {
  const song = await findPlayedSongByRank(rank);
  if (!song) {
    throw new Error("Song not found");
  }
  const songWithArt = await getPlayedSongArt(song);
  return songWithArt;
};

const getPlayedSongArt = async (
  playedSong: PlayedSong,
): Promise<PlayedSong> => {
  const song = rock2000songs.find(
    (rock2000song) =>
      rock2000song.SONG.toLowerCase() === playedSong.title.toLowerCase() &&
      rock2000song.ARTIST.toLowerCase() === playedSong.artist.toLowerCase(),
  );
  if (song) {
    return { ...playedSong, albumArt: song.ARTWORK };
  }
  return {
    ...playedSong,
    albumArt:
      "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
  };
};

/**
 * Fills in a `songs` row's `album`/`releaseYear` from a matching feed entry,
 * if they're still null. Returns the row unchanged if already populated, or
 * if the feed didn't have usable data to backfill with.
 */
export const backfillAlbumMetadata = async (
  songRow: typeof songs.$inferSelect,
  playedSong: PlayedSong,
): Promise<typeof songs.$inferSelect> => {
  if (songRow.album && songRow.releaseYear) {
    return songRow;
  }

  const parsedReleaseYear = playedSong.albumYear
    ? parseInt(playedSong.albumYear, 10)
    : null;
  const releaseYear =
    parsedReleaseYear !== null && !Number.isNaN(parsedReleaseYear)
      ? parsedReleaseYear
      : null;

  const album = songRow.album ?? playedSong.album ?? null;
  const finalReleaseYear = songRow.releaseYear ?? releaseYear;

  if (album === songRow.album && finalReleaseYear === songRow.releaseYear) {
    return songRow;
  }

  const [updated] = await db
    .update(songs)
    .set({ album, releaseYear: finalReleaseYear })
    .where(eq(songs.id, songRow.id))
    .returning();
  return updated;
};

/**
 * Rank path of `getSongDetail`: scenarios 2/3/4 from the plan.
 */
const getSongDetailForRank = async (rank: number): Promise<SongDetail> => {
  const currentYear = new Date().getFullYear();

  // The feed lookup and the DB lookup are independent (the DB query only
  // needs `rank`/`currentYear`), so run them concurrently.
  const [playedSong, existingResult] = await Promise.all([
    findPlayedSongByRank(rank),
    db
      .select({ song: songs })
      .from(countdownResults)
      .innerJoin(songs, eq(countdownResults.songId, songs.id))
      .where(
        and(
          eq(countdownResults.countdownYear, currentYear),
          eq(countdownResults.position, rank),
        ),
      )
      .limit(1),
  ]);

  if (!playedSong) {
    notFound();
  }

  // Scenario 2: a countdown_results row (for this year+rank) already
  // joins to a songs row, use that DB data directly, no Spotify call.

  if (existingResult.length > 0) {
    return {
      status: "played",
      song: toSongRecord(existingResult[0].song),
      rank,
      rankOneYearAgo: playedSong.rankOneYearAgo,
      rankTwoYearsAgo: playedSong.rankTwoYearsAgo,
    };
  }

  // Scenario 3: the songs row already exists (e.g. from a user's vote),
  // it's just missing its countdown_results row for this year.
  const matchedSongRow = await findSongRecordByTitleArtist(
    playedSong.title,
    playedSong.artist,
  );

  if (matchedSongRow) {
    const songRow = await backfillAlbumMetadata(matchedSongRow, playedSong);
    await db
      .insert(countdownResults)
      .values({
        songId: songRow.id,
        position: rank,
        countdownYear: currentYear,
      })
      .onConflictDoNothing();

    return {
      status: "played",
      song: toSongRecord(songRow),
      rank,
      rankOneYearAgo: playedSong.rankOneYearAgo,
      rankTwoYearsAgo: playedSong.rankTwoYearsAgo,
    };
  }

  // Scenario 4: neither exists yet, resolve the song via Spotify.
  const spotifyTrack = await getSpotifyTrackFromTitleAndArtist(
    playedSong.title,
    playedSong.artist,
  );
  if (!spotifyTrack) {
    return {
      status: "unresolved",
      title: playedSong.title,
      artist: playedSong.artist,
    };
  }

  const parsedReleaseYear = playedSong.albumYear
    ? parseInt(playedSong.albumYear, 10)
    : null;
  const releaseYear =
    parsedReleaseYear !== null && !Number.isNaN(parsedReleaseYear)
      ? parsedReleaseYear
      : (spotifyTrack.releaseYear ?? null);

  const [newSongRow] = await db
    .insert(songs)
    .values({
      spotifyId: spotifyTrack.spotifyId,
      title: spotifyTrack.title,
      artist: spotifyTrack.artist,
      albumArt: spotifyTrack.albumArt || null,
      album: playedSong.album || null,
      releaseYear,
    })
    .onConflictDoUpdate({
      target: songs.spotifyId,
      set: {
        title: spotifyTrack.title,
        artist: spotifyTrack.artist,
        albumArt: spotifyTrack.albumArt,
      },
    })
    .returning();

  await db
    .insert(countdownResults)
    .values({
      songId: newSongRow.id,
      position: rank,
      countdownYear: currentYear,
    })
    .onConflictDoNothing();

  return {
    status: "played",
    song: toSongRecord(newSongRow),
    rank,
    rankOneYearAgo: playedSong.rankOneYearAgo,
    rankTwoYearsAgo: playedSong.rankTwoYearsAgo,
  };
};

/**
 * Id path of `getSongDetail`: scenario 1 from the plan.
 */
const getSongDetailForId = async (id: string): Promise<SongDetail | null> => {
  if (!UUID_RE.test(id)) {
    return null;
  }

  const [songRow] = await db.select().from(songs).where(eq(songs.id, id));
  if (!songRow) {
    return null;
  }

  const playedSong = await findPlayedSongByTitleArtist(
    songRow.title,
    songRow.artist,
  );

  if (!playedSong) {
    return { status: "not-played", song: toSongRecord(songRow) };
  }

  const finalSongRow = await backfillAlbumMetadata(songRow, playedSong);

  return {
    status: "played",
    song: toSongRecord(finalSongRow),
    rank: parseInt(playedSong.rank, 10),
    rankOneYearAgo: playedSong.rankOneYearAgo,
    rankTwoYearsAgo: playedSong.rankTwoYearsAgo,
  };
};

/**
 * Looks up a song for the `/played-songs/[song]` route by either its
 * broadcast rank (plain integer) or its `songs.id` uuid. See the plan
 * ("Extend [song] route to look up by rank OR songs.id") for the full
 * scenario breakdown.
 */
export const getSongDetail = async (
  idOrRank: string,
): Promise<SongDetail> => {
  if (/^\d+$/.test(idOrRank)) {
    return getSongDetailForRank(parseInt(idOrRank, 10));
  }

  const result = await getSongDetailForId(idOrRank);
  if (!result) {
    notFound();
  }
  return result;
};

/**
 * How many users voted for a song this year, and whether a given user was
 * one of them. `currentUserId` is null for a logged-out visitor, in which
 * case `userVoted` is always false.
 */
export const getSongVoteSummary = async (
  songId: string,
  year: number,
  currentUserId: string | null,
): Promise<{ totalVotes: number; userVoted: boolean }> => {
  const rows = await db
    .select({ userId: votes.userId })
    .from(votes)
    .where(and(eq(votes.songId, songId), eq(votes.voteYear, year)));

  return {
    totalVotes: rows.length,
    userVoted: currentUserId
      ? rows.some((row) => row.userId === currentUserId)
      : false,
  };
};

/**
 * Resolves whatever's most recent in the MediaWorks feed via the same
 * rank-based DB backfill/Spotify-resolve path as `getSongDetail` — "now
 * playing" is just the newest rank in the feed.
 */
export const getCurrentSongDetail = async (): Promise<SongDetail> => {
  const currentPlayedSong = await getCurrentPlayedSong();
  return getSongDetail(currentPlayedSong.rank);
};

const GENERIC_STATION_ARTWORK =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

export const getAllPlayedSongsWithArt = async (): Promise<Song[]> => {
  // One query for the whole `songs` table, indexed once, then an O(1)
  // lookup per feed row below — not a per-row DB call, which would be
  // ~2000 full-table scans for this list.
  const [allPlayedSongs, songRecordIndex] = await Promise.all([
    getAllPlayedSongs(),
    buildSongRecordIndex(),
  ]);

  const updatedArtwork = allPlayedSongs.map((songToUpdate) => {
    const dbSongRecord = songRecordIndex.get(
      playedSongIndexKey(songToUpdate.title, songToUpdate.artist),
    );
    // Prefer the real Spotify-resolved art from the `songs` table (present
    // once a song has been voted for or its detail page visited); fall back
    // to the generic station artwork otherwise.
    const artwork = dbSongRecord?.albumArt || GENERIC_STATION_ARTWORK;

    const playedSong = rock2000songs.find(
      (song) =>
        songToUpdate.title.toLowerCase() === song.SONG.toLowerCase() &&
        songToUpdate.artist.toLowerCase() === song.ARTIST.toLowerCase(),
    );
    if (playedSong) {
      return {
        ...playedSong,
        ARTWORK: artwork,
        PLAYED_AT: parseInt(songToUpdate.rank),
        POINTS: 2000 - parseInt(songToUpdate.rank),
      };
    }
    return {
      SONG: songToUpdate.title,
      ARTIST: songToUpdate.artist,
      ARTWORK: artwork,
      PLAYED_AT: parseInt(songToUpdate.rank),
      POINTS: 2000 - parseInt(songToUpdate.rank),
    };
  });
  return updatedArtwork;
};

export const updateSong = async (song: Song) => {
  const playedSongs = await getAllPlayedSongs();
  const playedSongFromList = playedSongs.find(
    (playedSong) =>
      playedSong.title.toLowerCase() === song.SONG.toLowerCase() &&
      playedSong.artist.toLowerCase() === song.ARTIST.toLowerCase(),
  );
  if (!playedSongFromList) {
    return song;
  }
  return {
    ...song,
    PLAYED_AT: parseInt(playedSongFromList.rank),
    POINTS: 2000 - parseInt(playedSongFromList.rank),
  };
};

export const updateSongListPoints = async (songsToUpdate: Song[]) => {
  const allPlayedSongs = await getAllPlayedSongs();
  return songsToUpdate.map((songToUpdate) => {
    if (songToUpdate.POINTS !== undefined) {
      return songToUpdate;
    }
    const playedSongFromList = allPlayedSongs.find(
      (song) =>
        song.title.toLowerCase() === songToUpdate.SONG.toLowerCase() &&
        song.artist.toLowerCase() === songToUpdate.ARTIST.toLowerCase(),
    );

    if (!playedSongFromList) {
      return songToUpdate;
    }

    return {
      ...songToUpdate,
      PLAYED_AT: parseInt(playedSongFromList.rank),
      POINTS: 2000 - parseInt(playedSongFromList.rank),
    };
  });
};

// export const getUsersForLeaderBoard = async (): Promise<User[]> => {
//   const usersForLeaderBoard = await Promise.all(
//     users.map(async (user) => {
//       const userUpdatedSongs = await updateSongListPoints(user.songs);
//       const updatedUser = {
//         ...user,
//         songs: [...userUpdatedSongs],
//         points: await getUserPoints(userUpdatedSongs),
//         numberOfSongsPlayed: await getNumberOfSongsPlayed(userUpdatedSongs),
//       };
//       return updatedUser;
//     })
//   );
//   return usersForLeaderBoard;
// };

// export const getUserById = async (id: number): Promise<User | null> => {
//   const user = users.find((user) => user.id === id);
//   if (!user) {
//     return null;
//   }

//   const userUpdatedSongs = await updateSongListPoints(user.songs);
//   const updatedUser = {
//     ...user,
//     songs: [...userUpdatedSongs],
//     points: await getUserPoints(userUpdatedSongs),
//     numberOfSongsPlayed: await getNumberOfSongsPlayed(userUpdatedSongs),
//   };
//   return updatedUser;
// };
