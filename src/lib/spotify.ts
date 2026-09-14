"use server";
import { buildSpotifyQueryCandidates } from "./utils";

export interface SpotifySearchResult {
  spotifyId: string;
  title: string;
  artist: string;
  albumArt: string;
  releaseYear: number;
}

const SPOTIFY_API_BASE = "https://api.spotify.com";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

// Same generic station artwork used as the fallback everywhere else in the
// app (actions.ts, ShowNowPlaying, the [song] page) — there's no local
// "/fallback-record.png" asset, so this is the real fallback image.
const FALLBACK_ALBUM_ART =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

// Client-credentials tokens have no refresh token (refresh tokens only
// exist in the user-delegated authorization-code flow) — when this one
// expires or is rejected, the only thing to do is request a brand new one
// with the same client id/secret. Cached in-process rather than via Next's
// fetch cache: this is a POST request with an Authorization header, which
// Next only caches when `cache: "force-cache"` is set explicitly, and even
// then a cached *value* has no way to know Spotify has since rejected it —
// an explicit clear-and-retry on a 401 is needed regardless.
let cachedAccessToken: string | null = null;
let cachedTokenExpiresAt = 0;

function clearSpotifyToken(): void {
  cachedAccessToken = null;
  cachedTokenExpiresAt = 0;
}

async function fetchFreshSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("[spotify:missing-credentials]", {
      missingClientId: !clientId,
      missingClientSecret: !clientSecret,
      vercelEnv: process.env.VERCEL_ENV,
    });
    throw new Error(
      "Missing Spotify credentials inside .env.local configuration file.",
    );
  }

  // Spotify requires client keys to be passed as a Base64 encoded string wrapper
  const basicAuthToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuthToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    // We do our own in-memory caching below; don't let Next's fetch cache
    // also try to cache this (and possibly disagree with it).
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Spotify auth handshakes aborted: ${errorData}`);
  }

  const data = await response.json();
  const accessToken: string = data.access_token;
  // Refresh a little before Spotify's own expiry (60s buffer) rather than
  // cutting it exactly at the wire.
  cachedAccessToken = accessToken;
  cachedTokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
  return accessToken;
}

export async function getSpotifyServerToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedTokenExpiresAt) {
    return cachedAccessToken;
  }

  try {
    return await fetchFreshSpotifyToken();
  } catch (error) {
    console.error("Critical failure generating Spotify Client Token:", error);
    throw error;
  }
}

/**
 * Calls a Spotify API URL with the current cached token. If Spotify rejects
 * it with a 401 (expired, or invalid for any other reason — e.g. this
 * process having been idle past the token's real lifetime), clears the
 * cached token and retries exactly once with a freshly issued one.
 */
async function fetchSpotifyWithRetry(url: string): Promise<Response> {
  const token = await getSpotifyServerToken();
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });

  if (response.status === 429) {
    const bodyText = await response.clone().text();
    console.error("[spotify:rate-limited]", {
      url,
      retryAfter: response.headers.get("Retry-After"),
      body: bodyText,
    });
  }

  if (response.status !== 401) {
    return response;
  }

  console.warn("[spotify:token-retry-401]", { url });
  clearSpotifyToken();
  const freshToken = await getSpotifyServerToken();
  return fetch(url, {
    headers: { Authorization: `Bearer ${freshToken}` },
    next: { revalidate: 60 },
  });
}

export async function searchSpotifyTracks(
  query: string,
): Promise<SpotifySearchResult[]> {
  if (!query || query.trim() === "") return [];

  try {
    // Query the Spotify Web API track catalog (limiting parameters for clean dropdown UIs)
    const searchUrl = `${SPOTIFY_API_BASE}/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

    const response = await fetchSpotifyWithRetry(searchUrl);

    if (!response.ok) {
      throw new Error(
        `Spotify search query failed with status: ${response.status}`,
      );
    }

    const data = await response.json();
    const tracks = data.tracks?.items || [];

    // Map the raw complex JSON response into a clean, flat object footprint for our frontend
    return tracks.map((track: any) => {
      // Safely dig through Spotify's image array hierarchy for album artwork
      const albumArt = track.album?.images?.[0]?.url || FALLBACK_ALBUM_ART;
      const releaseYear = track.album?.release_date
        ? new Date(track.album.release_date).getFullYear()
        : new Date().getFullYear();

      return {
        spotifyId: track.id,
        title: track.name,
        artist: track.artists?.[0]?.name || "Unknown Artist",
        albumArt,
        releaseYear,
      };
    });
  } catch (error) {
    console.error(
      `Failed to process music lookup query for "${query}":`,
      error,
    );
    return []; // Return an empty array on failures to keep frontend UI components from crashing
  }
}

async function strictTrackSearch(
  title: string,
  artist: string,
): Promise<SpotifySearchResult | null> {
  // ⚡ Strict advanced filters wrap values in literal quotation marks ("")
  // to force Spotify to bypass loose recommendations and isolate the exact song.
  const strictQuery = `track:"${title.trim()}" artist:"${artist.trim()}"`;
  const searchUrl = `${SPOTIFY_API_BASE}/v1/search?q=${encodeURIComponent(strictQuery)}&type=track&limit=1`;

  const response = await fetchSpotifyWithRetry(searchUrl);

  if (!response.ok)
    throw new Error(
      `Strict match lookup failed with status: ${response.status}`,
    );

  const data = await response.json();
  const track = data.tracks?.items?.[0]; // Strictly isolate the top item block

  if (!track) return null; // No match found in the database catalog

  return {
    spotifyId: track.id,
    title: track.name,
    artist: track.artists?.[0]?.name || "Unknown Artist",
    albumArt: track.album?.images?.[0]?.url || FALLBACK_ALBUM_ART,
    releaseYear: track.album?.release_date
      ? new Date(track.album.release_date).getFullYear()
      : new Date().getFullYear(),
  };
}

export async function getSpotifyTrackFromTitleAndArtist(
  title: string,
  artist: string,
): Promise<SpotifySearchResult | null> {
  if (!title || !artist) return null;

  try {
    // Try progressively looser (title, artist) candidates — see
    // buildSpotifyQueryCandidates for what each loosening handles and why —
    // stopping at the first one that matches.
    const candidates = buildSpotifyQueryCandidates(title, artist);
    for (const candidate of candidates) {
      try {
        const track = await strictTrackSearch(candidate.title, candidate.artist);
        if (track) return track;
      } catch (error) {
        console.warn("[spotify:candidate-failed]", {
          title: candidate.title,
          artist: candidate.artist,
          error,
        });
      }
    }
    console.warn("[spotify:no-match]", {
      title,
      artist,
      candidatesTried: candidates.map((c) => `${c.title} - ${c.artist}`),
    });
    return null;
  } catch (error) {
    console.error(
      `Failed high-precision track resolution for "${title}" by ${artist}:`,
      error,
    );
    return null;
  }
}
