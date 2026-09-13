"use server";

import { db } from "@/db";
import { countdownResults, users, votes } from "@/db/schema";
import { and, eq } from "drizzle-orm/sql/expressions/conditions";
import { computeSongPoints } from "@/lib/scoring";

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  numberOfSongsPlayed: number;
};

export const getLeaderboard = async (
  year: number,
): Promise<LeaderboardEntry[]> => {
  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      isTopPick: votes.isTopPick,
      position: countdownResults.position,
    })
    .from(votes)
    .innerJoin(users, eq(votes.userId, users.id))
    .leftJoin(
      countdownResults,
      and(
        eq(countdownResults.songId, votes.songId),
        eq(countdownResults.countdownYear, year),
      ),
    )
    .where(eq(votes.voteYear, year));

  const byUser = new Map<
    string,
    { name: string; entries: { isTopPick: boolean; position: number | null }[] }
  >();

  for (const row of rows) {
    if (!byUser.has(row.userId)) {
      byUser.set(row.userId, { name: row.name, entries: [] });
    }
    byUser.get(row.userId)!.entries.push({
      isTopPick: row.isTopPick,
      position: row.position,
    });
  }

  const leaderboard = Array.from(byUser.entries()).map(
    ([userId, { name, entries }]) => {
      const played = entries.filter(
        (entry): entry is { isTopPick: boolean; position: number } =>
          entry.position !== null,
      );
      const bestPosition =
        played.length > 0 ? Math.min(...played.map((entry) => entry.position)) : null;

      const points = played.reduce(
        (sum, entry) => sum + computeSongPoints(entry, bestPosition),
        0,
      );

      return {
        id: userId,
        name,
        points,
        numberOfSongsPlayed: played.length,
      };
    },
  );

  return leaderboard.sort((a, b) => b.points - a.points);
};
