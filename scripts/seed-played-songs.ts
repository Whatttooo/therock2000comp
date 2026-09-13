/**
 * One-time backfill: seeds every already-played song from the MediaWorks
 * feed into the `songs` and `countdown_results` tables.
 *
 * This mirrors the same scenario logic `getSongDetailForRank` uses in
 * src/server/actions/actions.ts (check for an existing countdown_results
 * row -> check for an existing songs row -> otherwise resolve via Spotify),
 * just applied to the whole feed in one run instead of one song per page
 * view.
 *
 * Safe to re-run: anything already fully seeded (a songs row AND a
 * countdown_results row for this year) is skipped, so a run that dies
 * partway through only pays for what's left next time.
 *
 * DOES NOT run automatically. See the instructions for how to run it.
 *
 * Usage: npx tsx scripts/seed-played-songs.ts
 */

import "./_load-env";
import { createInterface } from "node:readline/promises";
import { db } from "../src/db";
import { songs, countdownResults } from "../src/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import {
  getAllPlayedSongs,
  buildSongRecordIndex,
  backfillAlbumMetadata,
  type PlayedSong,
} from "../src/server/actions/actions";
import { getSpotifyServerToken } from "../src/lib/spotify";
import type { SpotifySearchResult } from "../src/lib/spotify";
import { playedSongIndexKey, buildSpotifyQueryCandidates } from "../src/lib/utils";

// Same generic station artwork used as the fallback everywhere else in the
// app — there's no local "/fallback-record.png" asset.
const FALLBACK_ALBUM_ART =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

// A prior run at 5-concurrent/1s (well under Spotify's documented
// ~250-requests/30s client-credentials limit) still tripped a Spotify-side
// block with a ~24-hour Retry-After — the documented rolling-window limit
// isn't the whole story, so this is deliberately much more conservative:
// fully sequential (no concurrent requests at all), one every few seconds.
// Safety over speed for a script that only needs to run occasionally.
const REQUEST_DELAY_MS = 3000;

// On a 429, wait at least this long even if Spotify's own Retry-After
// suggests less, and never wait longer than this regardless of what
// Spotify asks for.
const MIN_RETRY_WAIT_MS = 30_000;
const MAX_RETRY_WAIT_MS = 120_000;

// If Spotify's own suggested wait exceeds this, that's a sign of a
// severe/extended block (we've seen a literal ~24-hour Retry-After), not a
// normal rate limit — continuing to hit other songs right after would
// almost certainly just repeat it, so the whole run aborts instead of
// grinding through the remaining backlog into more 429s.
const ABORT_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

const MAX_RATE_LIMIT_RETRIES = 2;

// Dev and prod share the same Spotify app credentials, so a run against one
// isn't an independent test for the other — the same rate-limit budget is
// shared between them. Rather than trust the automatic pacing/backoff alone
// on the very first run, Phase B pauses once, after the first CHECKPOINT_SIZE
// songs, and waits for an explicit keypress before continuing — a one-time
// confirmation that this run is behaving normally, not a repeating gate. The
// abort logic above is what actually catches a severe block, on every song,
// for the rest of the run; this checkpoint only exists because that logic
// has never been exercised against a real severe block yet. After it passes
// once, the rest of the run proceeds unattended.
const CHECKPOINT_SIZE = 25;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseAlbumYear(albumYear: string): number | null {
  const parsed = parseInt(albumYear, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

class SpotifyRateLimitAbortError extends Error {
  constructor(retryAfterSeconds: number) {
    super(
      `Spotify asked for a ${retryAfterSeconds}s wait — that's a sign of a severe/extended rate-limit block, not a normal one. Aborting the run rather than continuing to hit the same wall.`,
    );
    this.name = "SpotifyRateLimitAbortError";
  }
}

type SpotifySearchOutcome =
  | { track: SpotifySearchResult | null }
  | { rateLimited: true; retryAfterSeconds: number };

/**
 * A script-local copy of the strict search in lib/spotify.ts's
 * `getSpotifyTrackFromTitleAndArtist`, with two deliberate differences:
 * it takes a pre-fetched token (the app version fetches its own token per
 * call, cached via Next's fetch cache — a cache that doesn't exist outside
 * Next's runtime, so reusing it here would mean one real token request per
 * song), and it surfaces a 429 distinctly instead of swallowing every
 * failure into `null`, so the caller can back off and retry instead of
 * silently recording a false "no match".
 */
async function searchSpotifyStrict(
  token: string,
  title: string,
  artist: string,
): Promise<SpotifySearchOutcome> {
  const strictQuery = `track:"${title.trim()}" artist:"${artist.trim()}"`;
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(strictQuery)}&type=track&limit=1`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 429) {
    const retryAfterHeader = response.headers.get("Retry-After");
    const retryAfterSeconds = retryAfterHeader
      ? parseInt(retryAfterHeader, 10)
      : 5;
    return { rateLimited: true, retryAfterSeconds };
  }

  if (!response.ok) {
    console.error(
      `  Spotify search failed (${response.status}) for "${title}" by ${artist}`,
    );
    return { track: null };
  }

  const data = await response.json();
  const track = data.tracks?.items?.[0];
  if (!track) {
    return { track: null };
  }

  return {
    track: {
      spotifyId: track.id,
      title: track.name,
      artist: track.artists?.[0]?.name || "Unknown Artist",
      albumArt: track.album?.images?.[0]?.url || FALLBACK_ALBUM_ART,
      durationMs: track.duration_ms,
      releaseYear: track.album?.release_date
        ? new Date(track.album.release_date).getFullYear()
        : new Date().getFullYear(),
    },
  };
}

async function resolveOneCandidateWithRetry(
  token: string,
  title: string,
  artist: string,
): Promise<SpotifySearchResult | null> {
  for (let attempt = 1; attempt <= MAX_RATE_LIMIT_RETRIES; attempt++) {
    const outcome = await searchSpotifyStrict(token, title, artist);
    if ("track" in outcome) {
      return outcome.track;
    }

    const retryAfterMs = outcome.retryAfterSeconds * 1000;
    if (retryAfterMs > ABORT_THRESHOLD_MS) {
      throw new SpotifyRateLimitAbortError(outcome.retryAfterSeconds);
    }

    const waitMs = Math.min(
      Math.max(retryAfterMs, MIN_RETRY_WAIT_MS),
      MAX_RETRY_WAIT_MS,
    );
    console.warn(
      `  Rate limited resolving "${title}" by ${artist}; Spotify asked for ${outcome.retryAfterSeconds}s, waiting ${waitMs / 1000}s (attempt ${attempt}/${MAX_RATE_LIMIT_RETRIES})`,
    );
    await sleep(waitMs);
  }

  console.error(
    `  Giving up on "${title}" by ${artist} after ${MAX_RATE_LIMIT_RETRIES} rate-limit retries`,
  );
  return null;
}

/**
 * Tries progressively looser (title, artist) candidates — see
 * buildSpotifyQueryCandidates for what each loosening handles and why —
 * stopping at the first one that matches. A severe rate-limit block still
 * aborts the whole run immediately regardless of which candidate hit it.
 */
async function resolveWithRetry(
  token: string,
  rawTitle: string,
  rawArtist: string,
): Promise<SpotifySearchResult | null> {
  for (const candidate of buildSpotifyQueryCandidates(rawTitle, rawArtist)) {
    const track = await resolveOneCandidateWithRetry(
      token,
      candidate.title,
      candidate.artist,
    );
    if (track) return track;
  }
  return null;
}

type Failure = { title: string; artist: string; reason: string };

async function main() {
  const year = new Date().getFullYear();

  console.log("Fetching the played-songs feed and existing DB state...");
  const [allPlayedSongs, songRecordIndex, existingCountdownRows] =
    await Promise.all([
      getAllPlayedSongs(),
      buildSongRecordIndex(),
      db
        .select({ songId: countdownResults.songId })
        .from(countdownResults)
        .where(eq(countdownResults.countdownYear, year)),
    ]);

  const countdownSongIdsThisYear = new Set(
    existingCountdownRows.map((row) => row.songId),
  );

  const alreadyInSongsTable: PlayedSong[] = [];
  const needsSpotify: PlayedSong[] = [];

  for (const playedSong of allPlayedSongs) {
    const key = playedSongIndexKey(playedSong.title, playedSong.artist);
    if (songRecordIndex.has(key)) {
      alreadyInSongsTable.push(playedSong);
    } else {
      needsSpotify.push(playedSong);
    }
  }

  console.log(`${allPlayedSongs.length} songs in the feed.`);
  console.log(
    `${alreadyInSongsTable.length} already have a songs row (cheap path, no Spotify calls needed).`,
  );
  console.log(`${needsSpotify.length} need Spotify resolution.\n`);

  let alreadySeededCount = 0;
  let backfilledCount = 0;
  let resolvedCount = 0;
  const failures: Failure[] = [];

  // Phase A: songs already in the `songs` table. Just needs a
  // countdown_results row (and an album/releaseYear backfill if that's
  // still missing) — no Spotify calls, so no pacing concern.
  console.log("Phase A: backfilling songs already in the DB...");
  for (const playedSong of alreadyInSongsTable) {
    const key = playedSongIndexKey(playedSong.title, playedSong.artist);
    const existingSongRow = songRecordIndex.get(key)!;

    if (countdownSongIdsThisYear.has(existingSongRow.id)) {
      alreadySeededCount++;
      continue;
    }

    try {
      await backfillAlbumMetadata(existingSongRow, playedSong);
      await db
        .insert(countdownResults)
        .values({
          songId: existingSongRow.id,
          position: parseInt(playedSong.rank, 10),
          countdownYear: year,
        })
        .onConflictDoNothing();
      backfilledCount++;
    } catch (error) {
      failures.push({
        title: playedSong.title,
        artist: playedSong.artist,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  console.log(
    `  Done. ${alreadySeededCount} already fully seeded, ${backfilledCount} backfilled.\n`,
  );

  // Phase B: songs with no existing `songs` row — needs Spotify resolution.
  // Fully sequential, one request every REQUEST_DELAY_MS, deliberately
  // conservative after a prior run's concurrent-batch pacing still tripped
  // a severe rate-limit block (see the comment on REQUEST_DELAY_MS above).
  // Also pauses once, after the first CHECKPOINT_SIZE songs, for a manual
  // keypress — see the comment on CHECKPOINT_SIZE above.
  console.log(
    `Phase B: resolving ${needsSpotify.length} songs via Spotify (one at a time, ${REQUEST_DELAY_MS}ms apart, pausing once after the first ${CHECKPOINT_SIZE} for confirmation)...`,
  );
  const token = await getSpotifyServerToken();
  let abortedEarly = false;
  let stoppedByUser = false;
  let hasPassedCheckpoint = false;
  const rl = needsSpotify.length > 0
    ? createInterface({ input: process.stdin, output: process.stdout })
    : null;

  for (let i = 0; i < needsSpotify.length; i++) {
    const playedSong = needsSpotify[i];

    try {
      const track = await resolveWithRetry(
        token,
        playedSong.title,
        playedSong.artist,
      );

      if (!track) {
        failures.push({
          title: playedSong.title,
          artist: playedSong.artist,
          reason: "No Spotify match found",
        });
      } else {
        const releaseYear =
          parseAlbumYear(playedSong.albumYear) ?? track.releaseYear ?? null;

        const [songRow] = await db
          .insert(songs)
          .values({
            spotifyId: track.spotifyId,
            title: track.title,
            artist: track.artist,
            albumArt: track.albumArt || null,
            album: playedSong.album || null,
            releaseYear,
          })
          .onConflictDoUpdate({
            target: songs.spotifyId,
            set: {
              title: track.title,
              artist: track.artist,
              albumArt: track.albumArt,
            },
          })
          .returning();

        await db
          .insert(countdownResults)
          .values({
            songId: songRow.id,
            position: parseInt(playedSong.rank, 10),
            countdownYear: year,
          })
          .onConflictDoNothing();

        resolvedCount++;
      }
    } catch (error) {
      if (error instanceof SpotifyRateLimitAbortError) {
        console.error(`\n${error.message}`);
        console.error(
          `Stopping after ${i}/${needsSpotify.length} songs in this phase. Re-run the script later to pick up where this left off — already-seeded songs are skipped.`,
        );
        abortedEarly = true;
        break;
      }
      failures.push({
        title: playedSong.title,
        artist: playedSong.artist,
        reason: error instanceof Error ? error.message : String(error),
      });
    }

    const processed = i + 1;
    const isLast = processed === needsSpotify.length;
    if (processed % 10 === 0 || isLast) {
      console.log(`  ${processed}/${needsSpotify.length} processed...`);
    }

    if (isLast) {
      break;
    }

    if (!hasPassedCheckpoint && processed % CHECKPOINT_SIZE === 0) {
      hasPassedCheckpoint = true;
      console.log(
        `\n  First ${CHECKPOINT_SIZE} done (${resolvedCount} resolved, ${failures.length} failed so far).`,
      );
      const answer = await rl!.question(
        "  Looks normal? Press Enter to run the rest unattended (or type 'q' + Enter to stop here): ",
      );
      if (answer.trim().toLowerCase().startsWith("q")) {
        console.log(`\nStopped by user request after ${processed}/${needsSpotify.length} songs in this phase.`);
        stoppedByUser = true;
        break;
      }
      console.log("");
    } else {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  rl?.close();

  console.log("\n--- Summary ---");
  if (abortedEarly) {
    console.log("Run stopped early due to a severe Spotify rate-limit block (see above).");
  }
  if (stoppedByUser) {
    console.log("Run stopped by user request. Re-run the script later to pick up where this left off — already-seeded songs are skipped.");
  }
  console.log(`Already fully seeded (skipped): ${alreadySeededCount}`);
  console.log(`Backfilled countdown_results for existing songs: ${backfilledCount}`);
  console.log(`Newly resolved via Spotify: ${resolvedCount}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.log("\nFailures (re-running the script will retry these):");
    for (const failure of failures) {
      console.log(`  - "${failure.title}" by ${failure.artist}: ${failure.reason}`);
    }
  }

  process.exit(abortedEarly || failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Seed script crashed:", error);
  process.exit(1);
});
