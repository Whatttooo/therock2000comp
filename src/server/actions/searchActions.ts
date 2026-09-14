"use server";

import { db } from "@/db";
import { songs } from "@/db/schema";
import { searchSpotifyTracks } from "@/lib/spotify";
import { and, ilike, notIlike, or } from "drizzle-orm/sql/expressions/conditions";

export interface SongSearchResult {
  id: string | null;
  spotifyId: string;
  title: string;
  artist: string;
  albumArt: string;
  album: string | null;
  releaseYear: number;
}

const SEARCH_RESULT_LIMIT = 10;

const FALLBACK_ALBUM_ART =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

export async function searchSongsInDb(
  query: string,
): Promise<SongSearchResult[]> {
  if (!query || query.trim() === "") return [];

  const term = `%${query.trim()}%`;
  const rows = await db
    .select()
    .from(songs)
    .where(
      and(
        or(ilike(songs.title, term), ilike(songs.artist, term)),
        notIlike(songs.spotifyId, "manual:%"),
      ),
    )
    .limit(SEARCH_RESULT_LIMIT);

  return rows.map((row) => ({
    id: row.id,
    spotifyId: row.spotifyId,
    title: row.title,
    artist: row.artist,
    albumArt: row.albumArt || FALLBACK_ALBUM_ART,
    album: row.album,
    releaseYear: row.releaseYear ?? new Date().getFullYear(),
  }));
}

export async function searchSpotifyRemainder(
  query: string,
  excludeSpotifyIds: string[],
  limit: number,
): Promise<SongSearchResult[]> {
  if (limit <= 0) return [];

  const excludeSet = new Set(excludeSpotifyIds);
  const tracks = await searchSpotifyTracks(query);

  return tracks
    .filter((track) => !excludeSet.has(track.spotifyId))
    .slice(0, limit)
    .map((track) => ({
      id: null,
      spotifyId: track.spotifyId,
      title: track.title,
      artist: track.artist,
      albumArt: track.albumArt,
      album: null,
      releaseYear: track.releaseYear,
    }));
}
