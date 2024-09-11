"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentSong } from "@/server/actions/actions";
import Image from "next/image";
import type { Song } from "@/data/rock2000songs";
import { Button } from "../ui/button";

export function ShowNowPlaying({ initialData }: { initialData: Song }) {
  const { data, error, refetch, isRefetching } = useQuery<Song>({
    queryFn: () => getCurrentSong(),
    queryKey: ["currentSong"],
    initialData: initialData,
  });

  return (
    <div className="flex gap-5 justify-center items-center">
      {error ? (
        <>
          <div>Error fetching song</div>
          <pre>{error.message}</pre>
        </>
      ) : (
        <>
          <Image
            src={
              data?.ARTWORK ||
              "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto"
            }
            width={50}
            height={50}
            alt="album art of now playing"
          />
          <h2 className="text-2xl">{data.SONG}</h2>
          <h2 className="text-xl">{data.ARTIST}</h2>
        </>
      )}
      {isRefetching ? (
        <div>Refreshing...</div>
      ) : (
        <Button
          onClick={() => refetch()}
          className="bg-red-700 text-white hover:bg-red-400"
        >
          Refresh
        </Button>
      )}
    </div>
  );
}
