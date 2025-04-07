import type { Song } from "@/data/rock2000songs";
import type { PlayedSong } from "./actions";
import { rock2000songs } from "@/data/rock2000songs";

/**
 * Searches for songs based on a search term.
 *
 * @param term - The search term.
 * @param songs - The list of songs to search within.
 * @returns An array of songs that match the search term.
 */
export const searchSongs = (term: string, songs: Song[]): Song[] => {
  if (!term) return songs;
  const lowercasedTerm = term.toLowerCase();
  return songs.filter(
    (song) =>
      song.SONG.toLowerCase().includes(lowercasedTerm) ||
      song.ARTIST.toLowerCase().includes(lowercasedTerm),
  );
};

/**
 * Retrieves a song from the list of played songs based on the provided played song object.
 *
 * @param playedSong - The played song object containing the title and artist of the song.
 * @returns {Song}  The matching song object from the list of played songs, or null if no match is found.
 */
export const getSongFromPlayedSong = (playedSong: PlayedSong): Song | null => {
  const { title, artist } = playedSong;
  const song = rock2000songs.find(
    (song) => song.SONG === title && song.ARTIST === artist,
  );
  return song || null;
};

export const getUserPoints = (songs: Song[]): number => {
  const songsWithPoints = songs.filter((song) => song.POINTS !== undefined);

  return songsWithPoints.reduce((acc, song) => acc + (song.POINTS ?? 0), 0);
};

export const getNumberOfSongsPlayed = (songs: Song[]): number => {
  return songs.filter((song) => song.POINTS !== undefined).length;
};

export const getMostRecentlyPlayedSong = (songs: Song[]): Song => {
  const songWithHighestPoints = songs.reduce((prevSong, currentSong) => {
    return currentSong.POINTS && currentSong.POINTS > (prevSong?.POINTS ?? 0)
      ? currentSong
      : prevSong;
  });

  return songWithHighestPoints;
};
