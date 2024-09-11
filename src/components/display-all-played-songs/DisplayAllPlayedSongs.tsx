"use client";
import { Song } from "@/data/rock2000songs";
import { SongCard } from "../song-card/SongCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import { searchSongs } from "@/server/actions/actions";
import { Skeleton } from "../ui/skeleton";

interface DisplayAllPlayedSongsProps {
  songs: Song[];
}

export const DisplayAllPlayedSongs = ({
  songs,
}: DisplayAllPlayedSongsProps) => {
  const [searchedSongs, setSearchedSongs] = useState<Song[]>(songs);
  const [filtering, setFiltering] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnChange = useDebouncedCallback(async (songTerm) => {
    setLoading(true);
    const songResults = await searchSongs(songTerm, songs);
    setSearchedSongs(songResults);
    setLoading(false);
  }, 500);

  useEffect(() => {
    setSearchedSongs(songs);
  }, [songs]);

  const filteredSongs = useMemo(() => {
    return searchedSongs;
  }, [searchedSongs]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFiltering(event.target.value);
      handleOnChange(event.target.value);
    },
    [handleOnChange]
  );

  return (
    <div className="flex flex-col gap-7">
      <div className="p-3">
        <h1 className="text-2xl md:text-6xl font-bold">All played songs 🎸</h1>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter songs..."
            value={filtering}
            onChange={handleInputChange}
            className="max-w-sm"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col gap-7">
          <div className="flex items-center py-4">
            <Skeleton className="max-w-sm h-10" />
          </div>
          <div className="flex gap-3 md:gap-5 flex-wrap">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="w-full md:w-64 h-64" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 md:gap-5 flex-wrap justify-center md:justify-start">
          {Array.isArray(filteredSongs) && filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <SongCard key={`${song.SONG} ${song.ARTIST}`} song={song} />
            ))
          ) : (
            <div>No songs found</div>
          )}
        </div>
      )}
    </div>
  );
};
