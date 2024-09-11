import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Song } from "@/data/rock2000songs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const SongCard = ({ song }: { song: Song }) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/played-songs/${song.PLAYED_AT}`)}
      className="flex flex-col justify-center items-center w-fit max-w-64 cursor-pointer hover:scale-125 transition-all"
    >
      <CardHeader className="p-2">
        <Image
          className="rounded-lg"
          src={song.ARTWORK}
          width={250}
          height={250}
          alt="album art of current song"
        />
      </CardHeader>
      <CardContent className="pl-3 pt-3">
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-xl font-semibold">{song.SONG}</h2>
          <div className="flex gap-4 justify-between">
            <h3 className="text-base font-semibold text-wrap text-muted-foreground">
              by {song.ARTIST}
            </h3>
            <h3 className="text-base font-semibold text-muted-foreground">
              {song.PLAYED_AT}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
