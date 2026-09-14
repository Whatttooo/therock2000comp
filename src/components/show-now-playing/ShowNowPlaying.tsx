"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentSongDetail, SongDetail } from "@/server/actions/actions";
import Image from "next/image";
import { Button } from "../ui/button";

const GENERIC_STATION_ARTWORK =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

export function ShowNowPlaying({ initialData }: { initialData: SongDetail }) {
  const { data, error, refetch, isRefetching } = useQuery<SongDetail>({
    queryFn: () => getCurrentSongDetail(),
    queryKey: ["currentSong"],
    initialData: initialData,
  });

  return (
    <div className="flex gap-3 md:gap-5 items-center min-w-0">
      {error ? (
        <>
          <div>Error fetching song</div>
          <pre>{error.message}</pre>
        </>
      ) : data.status === "unresolved" ? (
        <>
          <Image
            src={GENERIC_STATION_ARTWORK}
            width={50}
            height={50}
            alt="album art of now playing"
          />
          <div className="flex flex-col md:flex-row md:gap-3 min-w-0">
            <h2 className="md:text-xl truncate min-w-0">{data.title}</h2>
            <h2 className="md:text-lg text-muted-foreground truncate min-w-0">
              {data.artist}
            </h2>
          </div>
        </>
      ) : (
        <>
          <Image
            src={data.song.albumArt || GENERIC_STATION_ARTWORK}
            width={50}
            height={50}
            alt="album art of now playing"
          />
          <div className="flex flex-col md:flex-row md:gap-3 min-w-0">
            <h2 className="md:text-xl truncate min-w-0">{data.song.title}</h2>
            <h2 className="md:text-lg text-muted-foreground truncate min-w-0">
              {data.song.artist}
            </h2>
          </div>
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
