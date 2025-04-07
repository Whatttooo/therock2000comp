"use server";
import type { Song } from "@/data/rock2000songs";
import { rock2000songs } from "@/data/rock2000songs";
import { type User, users } from "@/data/users";
import {
  getNumberOfSongsPlayed,
  getSongFromPlayedSong,
  getUserPoints,
} from "./actionUtils";
const rock2000PlayedEndpoint =
  "https://radio-api.mediaworks.nz/comp-api/v1/countdown/therock";

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
    const response = await fetch(rock2000PlayedEndpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("error fetching all songs");
  }
};

export const getSongByRank = async (rank: number): Promise<PlayedSong> => {
  const allPlayedSongs = await getAllPlayedSongs();
  const song = allPlayedSongs.find((song) => parseInt(song.rank) === rank);
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

export const getAllPlayedSongsWithArt = async (): Promise<Song[]> => {
  const allPlayedSongs = await getAllPlayedSongs();
  const updatedArtwork = allPlayedSongs.map((songToUpdate) => {
    const playedSong = rock2000songs.find(
      (song) =>
        songToUpdate.title.toLowerCase() === song.SONG.toLowerCase() &&
        songToUpdate.artist.toLowerCase() === song.ARTIST.toLowerCase(),
    );
    if (playedSong) {
      return {
        ...playedSong,
        ARTWORK: playedSong.ARTWORK,
        PLAYED_AT: parseInt(songToUpdate.rank),
        POINTS: 2000 - parseInt(songToUpdate.rank),
      };
    }
    return {
      SONG: songToUpdate.title,
      ARTIST: songToUpdate.artist,
      ARTWORK:
        "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto",
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

export const getUsersForLeaderBoard = async (): Promise<User[]> => {
  const usersForLeaderBoard = await Promise.all(
    users.map(async (user) => {
      const userUpdatedSongs = await updateSongListPoints(user.songs);
      const updatedUser = {
        ...user,
        songs: [...userUpdatedSongs],
        points: await getUserPoints(userUpdatedSongs),
        numberOfSongsPlayed: await getNumberOfSongsPlayed(userUpdatedSongs),
      };
      return updatedUser;
    }),
  );
  return usersForLeaderBoard;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return null;
  }

  const userUpdatedSongs = await updateSongListPoints(user.songs);
  const updatedUser = {
    ...user,
    songs: [...userUpdatedSongs],
    points: await getUserPoints(userUpdatedSongs),
    numberOfSongsPlayed: await getNumberOfSongsPlayed(userUpdatedSongs),
  };
  return updatedUser;
};
