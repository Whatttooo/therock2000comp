/**
 * One-time migration helper: copies `songs` and `countdown_results` rows
 * from the dev database to prod, so prod doesn't have to re-resolve the
 * same songs against Spotify (expensive, and shares the same rate-limited
 * quota as prod, see the QUOTA_EXCEEDED incident this is responding to).
 *
 * Only ever touches `songs` and `countdown_results`. Never imports or
 * reads votes/users/sessions/accounts/verifications, and so can never
 * write them, dev's test votes and test accounts must never reach prod.
 *
 * Safe to re-run: every insert is onConflictDoNothing, so an interrupted
 * or repeated run only adds what's still missing.
 *
 * DOES NOT run automatically.
 *
 * Usage: PROD_DATABASE_URL=<prod connection string> npx tsx scripts/copy-songs-to-prod.ts
 */

import "./_load-env";
import { createInterface } from "node:readline/promises";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, inArray } from "drizzle-orm/sql/expressions/conditions";
import { songs, countdownResults } from "../src/db/schema";
import { db as devDb } from "../src/db";

async function main() {
  const prodUrl = process.env.PROD_DATABASE_URL;
  if (!prodUrl) {
    console.error(
      "Missing PROD_DATABASE_URL.\nUsage: PROD_DATABASE_URL=<prod connection string> npx tsx scripts/copy-songs-to-prod.ts",
    );
    process.exit(1);
  }

  const prodDb = drizzle({
    client: neon(prodUrl),
    schema: { songs, countdownResults },
  });

  console.log("Reading songs and countdown_results from dev...");
  const devSongs = await devDb.select().from(songs);
  const devResults = await devDb
    .select({
      spotifyId: songs.spotifyId,
      position: countdownResults.position,
      countdownYear: countdownResults.countdownYear,
    })
    .from(countdownResults)
    .innerJoin(songs, eq(countdownResults.songId, songs.id));

  console.log(
    `Found ${devSongs.length} songs and ${devResults.length} countdown_results rows in dev.\n`,
  );

  if (devSongs.length === 0) {
    console.log("Nothing to copy.");
    return;
  }

  const devSpotifyIds = devSongs.map((s) => s.spotifyId);
  const existingProdSongs = await prodDb
    .select({ spotifyId: songs.spotifyId })
    .from(songs)
    .where(inArray(songs.spotifyId, devSpotifyIds));
  const alreadyInProdCount = existingProdSongs.length;

  console.log(
    `${alreadyInProdCount} of those songs already exist in prod (will be skipped).`,
  );
  console.log(
    `${devSongs.length - alreadyInProdCount} new songs will be inserted.\n`,
  );

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question("Proceed with copying into PROD? (y/N): ");
  rl.close();
  if (answer.trim().toLowerCase() !== "y") {
    console.log("Aborted, nothing written.");
    return;
  }

  console.log("\nInserting songs into prod...");
  let insertedSongs = 0;
  for (const song of devSongs) {
    const [row] = await prodDb
      .insert(songs)
      .values({
        id: song.id,
        spotifyId: song.spotifyId,
        title: song.title,
        artist: song.artist,
        albumArt: song.albumArt,
        album: song.album,
        releaseYear: song.releaseYear,
      })
      .onConflictDoNothing()
      .returning({ id: songs.id });
    if (row) insertedSongs++;
  }
  console.log(
    `Inserted ${insertedSongs} new songs (${devSongs.length - insertedSongs} already existed).`,
  );

  console.log("\nMapping spotifyId -> prod songs.id...");
  const prodSongRows = await prodDb
    .select({ id: songs.id, spotifyId: songs.spotifyId })
    .from(songs)
    .where(inArray(songs.spotifyId, devSpotifyIds));
  const spotifyIdToProdId = new Map(
    prodSongRows.map((r) => [r.spotifyId, r.id]),
  );

  console.log("Inserting countdown_results into prod...");
  let insertedResults = 0;
  let skippedNoSong = 0;
  for (const result of devResults) {
    const prodSongId = spotifyIdToProdId.get(result.spotifyId);
    if (!prodSongId) {
      skippedNoSong++;
      console.warn(
        `  Skipping countdown_results row: no prod song found for spotifyId ${result.spotifyId}`,
      );
      continue;
    }
    const [row] = await prodDb
      .insert(countdownResults)
      .values({
        songId: prodSongId,
        position: result.position,
        countdownYear: result.countdownYear,
      })
      .onConflictDoNothing()
      .returning({ id: countdownResults.id });
    if (row) insertedResults++;
  }
  console.log(
    `Inserted ${insertedResults} new countdown_results rows (${
      devResults.length - insertedResults - skippedNoSong
    } already existed${skippedNoSong > 0 ? `, ${skippedNoSong} skipped (no matching prod song)` : ""}).`,
  );

  console.log(
    "\nDone. votes/users/sessions/accounts/verifications were never read or touched.",
  );
}

main().catch((error) => {
  console.error("Copy script crashed:", error);
  process.exit(1);
});
