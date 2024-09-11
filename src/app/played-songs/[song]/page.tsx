import { Card } from "@/components/ui/card";
import { getSongByRank } from "@/server/actions/actions";
import { TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

interface SongPageProps {
  params: { song: string };
}

export default async function SongPage({ params }: SongPageProps) {
  const song = await getSongByRank(parseInt(params.song));
  const calculatePlacesUpOrDown =
    parseInt(song.rankOneYearAgo) - parseInt(song.rank);

  return (
    <>
      <Card className="p-3 m-4 md:m-0">
        <div className="flex flex-col md:flex-row gap-8">
          <Image
            className="rounded-lg"
            src={song.albumArt}
            alt={song.title}
            width={500}
            height={500}
          />
          <div className="flex flex-col justify-between p-3">
            <div>
              <h1 className="text-3xl">
                <span className="text-red-400">{song.rank}:</span> {song.title}
              </h1>
              <h2 className="text-2xl">{song.artist}</h2>
              <p>
                Album: {song.album}. Released in {song.albumYear}
              </p>
              {calculatePlacesUpOrDown > 0 ? (
                <div className="flex gap-3 text-green-500 text-2xl items-center">
                  Up {calculatePlacesUpOrDown} <TrendingUp size={24} />
                </div>
              ) : (
                <div className="flex gap-3 text-red-500 text-2xl items-center">
                  Down {Math.abs(calculatePlacesUpOrDown)}{" "}
                  <TrendingDown size={24} />
                </div>
              )}
            </div>

            <div>
              <p className="text-muted-foreground">
                Last year: {song.rankOneYearAgo}
              </p>
              <p className="text-muted-foreground">
                Rank Two Years Ago: {song.rankTwoYearsAgo}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
