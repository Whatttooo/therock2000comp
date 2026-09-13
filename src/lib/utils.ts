import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A small set of known one-off title/artist spellings that don't fit any
// general rule below (found via two audits comparing this app's `songs`
// table against the live feed and last year's results). Applied first, on
// the lowercased-but-otherwise-raw string, so everything downstream sees
// the canonical form. This is the escape valve for future one-offs too —
// add here rather than inventing a new heuristic for a single song.
const KNOWN_ALIASES: [RegExp, string][] = [
  [/\bmeatloaf\b/gi, "meat loaf"], // artist stage name spelled as one word or two
  [/\bchoirgirl\b/gi, "choir girl"], // same "compound word" issue, on a title this time
  [/^i used to love her\b/i, "used to love her"], // feed adds a leading "I" Spotify's canonical title omits
];

// Common British vs American spelling pairs — a NZ station's feed vs
// Spotify's largely-American catalog surfaces these occasionally (e.g.
// "Saviour" vs "Savior"). A small known-word list rather than a "-our"/
// "-or" suffix regex, since that would also mangle ordinary words like
// "your", "tour", "hour", "sour" that aren't spelling variants at all.
const UK_US_SPELLING_PAIRS: [string, string][] = [
  ["saviour", "savior"],
  ["colour", "color"],
  ["favour", "favor"],
  ["favourite", "favorite"],
  ["honour", "honor"],
  ["humour", "humor"],
  ["neighbour", "neighbor"],
  ["harbour", "harbor"],
  ["rumour", "rumor"],
  ["labour", "labor"],
  ["behaviour", "behavior"],
  ["armour", "armor"],
  ["flavour", "flavor"],
  ["glamour", "glamor"],
  ["parlour", "parlor"],
  ["theatre", "theater"],
  ["centre", "center"],
  ["metre", "meter"],
  ["grey", "gray"],
  ["travelling", "traveling"],
  ["traveller", "traveler"],
  ["jewellery", "jewelry"],
  ["realise", "realize"],
  ["organise", "organize"],
  ["recognise", "recognize"],
  ["apologise", "apologize"],
];
const UK_US_SPELLING_REGEX = new RegExp(
  `\\b(${UK_US_SPELLING_PAIRS.map(([uk]) => uk).join("|")})\\b`,
  "gi",
);

// Spelled-out numbers vs numerals in band/song names (e.g. feed "30 Seconds
// To Mars" vs Spotify's canonical "Thirty Seconds To Mars", "Matchbox 20"
// vs "Matchbox Twenty"). Words convert to digits, the canonical direction —
// the feed already writes these as numerals, so this makes both sides match
// the feed's own convention.
const NUMBER_WORD_TO_DIGIT: [string, string][] = [
  ["nineteen", "19"],
  ["eighteen", "18"],
  ["seventeen", "17"],
  ["sixteen", "16"],
  ["fifteen", "15"],
  ["fourteen", "14"],
  ["thirteen", "13"],
  ["eleven", "11"],
  ["twelve", "12"],
  ["hundred", "100"],
  ["seventy", "70"],
  ["eighty", "80"],
  ["ninety", "90"],
  ["twenty", "20"],
  ["thirty", "30"],
  ["forty", "40"],
  ["fifty", "50"],
  ["sixty", "60"],
  ["zero", "0"],
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
  ["ten", "10"],
];
const NUMBER_WORD_REGEX = new RegExp(
  `\\b(${NUMBER_WORD_TO_DIGIT.map(([word]) => word).join("|")})\\b`,
  "gi",
);

// Parenthetical/bracketed content and " - suffix" content only get dropped
// when they look decorative (a remaster/live/feat. tag etc.) — content that's
// actually part of a song's real title (e.g. Disturbed's "Shout (2000)", or
// Weezer's "Undone - The Sweater Song") is kept, since blindly stripping
// any parenthetical/dash suffix caused those to stop matching the same
// song's differently-styled canonical title from Spotify.
const DECORATIVE_SUFFIX_KEYWORDS =
  /\b(remaster(ed)?|re[\s-]?record(ed)?|re[\s-]?issue(d)?|live|feat\.?|featuring|radio edit|single version|album version|deluxe|mono|stereo|explicit|clean|bonus track|extended|edit|version|mix|remix|demo|acoustic|instrumental|unplugged|anniversary edition)\b/i;

export function normalizeSongTitle(title: string): string {
  let result = title.toLowerCase();

  for (const [pattern, replacement] of KNOWN_ALIASES) {
    result = result.replace(pattern, replacement);
  }

  result = result
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics (ö -> o, ü -> u, etc.) so accented and plain-ASCII spellings of the same name match
    .replace(UK_US_SPELLING_REGEX, (match) => {
      const pair = UK_US_SPELLING_PAIRS.find(([uk]) => uk === match.toLowerCase());
      return pair ? pair[1] : match;
    })
    .replace(/^the\s+/, "") // "The Goo Goo Dolls" should match "Goo Goo Dolls"
    .replace(/\s*[-–—]\s*(.+)$/, (match, suffix: string) =>
      DECORATIVE_SUFFIX_KEYWORDS.test(suffix) ? " " : match,
    )
    .replace(/\s*[([]([^()[\]]*)[)\]]\s*/g, (match, inner: string) =>
      DECORATIVE_SUFFIX_KEYWORDS.test(inner) ? " " : match,
    )
    .replace(/['’]/g, "") // drop apostrophes entirely (not to a space) so "Year's" matches "Years"
    .replace(/&/g, " and ") // "Sex & Candy" should match "Sex And Candy"
    .replace(NUMBER_WORD_REGEX, (match) => {
      const pair = NUMBER_WORD_TO_DIGIT.find(([word]) => word === match.toLowerCase());
      return pair ? pair[1] : match;
    })
    .replace(/[^a-z0-9]+/g, " ") // strip remaining punctuation
    .trim()
    .replace(/\s+/g, " ");

  // Collapse immediately-repeated identical words ("na na na na" -> "na")
  // so different repeat-counts of a stutter/onomatopoeia word match (e.g.
  // "Mmm Mmm Mmm" vs "Mmm Mmm Mmm Mmm").
  const words = result.split(" ");
  const collapsed: string[] = [];
  for (const word of words) {
    if (collapsed[collapsed.length - 1] !== word) {
      collapsed.push(word);
    }
  }
  return collapsed.join(" ");
}

// Artist fields sometimes carry a secondary/featured credit that the other
// source doesn't include (e.g. feed "George Thorogood" vs Spotify's
// "George Thorogood & The Destroyers", or "Jimmy Barnes/INXS" vs "Jimmy
// Barnes") — only the primary (first-listed) artist is used for matching.
const SECONDARY_ARTIST_SPLIT_REGEX =
  /\s*(\/|,|&|\bfeat\.?\b|\bfeaturing\b|\bft\.?\b|\bx\b)\s*/i;

export function extractPrimaryArtist(artist: string): string {
  const [primary] = artist.split(SECONDARY_ARTIST_SPLIT_REGEX);
  return primary.trim();
}

export function playedSongIndexKey(title: string, artist: string): string {
  return `${normalizeSongTitle(title)}|${normalizeSongTitle(extractPrimaryArtist(artist))}`;
}

// Builds an ordered list of (title, artist) pairs to try against Spotify's
// strict `track:"..." artist:"..."` search, strictest first. Each loosening
// only ever gets tried after every stricter candidate already failed, so a
// wrong guess this far down the list can only turn an existing "no match"
// into a different (still artist-filtered) search, never override a match a
// stricter candidate already found.
//
// - Dropping to the primary artist handles a feed artist field carrying a
//   secondary/featured credit Spotify's own artist field doesn't (see
//   extractPrimaryArtist).
// - Stripping parenthetical/bracketed content handles a feed title carrying
//   a version/session marker ("(MTV Unplugged)") that doesn't match
//   Spotify's own suffix for the same recording ("- Live").
// - Taking the text before a "/" handles a feed title that names a two-song
//   segued medley ("Brain Damage/Eclipse") as one entry, when Spotify only
//   has the first song as its own track.
// - Taking the artist text before " and "/" & " is last-resort only: it
//   handles a feed artist field crediting two named performers as a single
//   string ("Gary Moore and Phil Lynott") where Spotify credits only the
//   first as the track's primary artist. This intentionally isn't merged
//   into extractPrimaryArtist itself, splitting on a bare "and" there would
//   also mangle a real band name that happens to contain one ("Hootie and
//   the Blowfish", "Emerson, Lake and Palmer").
export function buildSpotifyQueryCandidates(
  rawTitle: string,
  rawArtist: string,
): { title: string; artist: string }[] {
  const primaryArtist = extractPrimaryArtist(rawArtist);
  const titleWithoutParenthetical = rawTitle
    .replace(/\s*[([][^()[\]]*[)\]]\s*/g, " ")
    .trim();
  const titleBeforeSlash = rawTitle.split("/")[0].trim();
  const artistBeforeAnd = primaryArtist.split(/\s+and\s+/i)[0].trim();

  const candidates: { title: string; artist: string }[] = [
    { title: rawTitle, artist: rawArtist },
  ];
  const seen = new Set([`${rawTitle}|${rawArtist}`]);
  const add = (title: string, artist: string) => {
    const key = `${title}|${artist}`;
    if (!seen.has(key)) {
      seen.add(key);
      candidates.push({ title, artist });
    }
  };

  add(rawTitle, primaryArtist);
  if (titleWithoutParenthetical !== rawTitle) {
    add(titleWithoutParenthetical, primaryArtist);
  }
  if (titleBeforeSlash !== rawTitle) {
    add(titleBeforeSlash, primaryArtist);
  }
  if (artistBeforeAnd !== primaryArtist) {
    add(rawTitle, artistBeforeAnd);
  }

  return candidates;
}
