import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSongDetail, getSongVoteSummary } from "@/server/actions/actions";
import { ArrowLeft, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function BackToPlayedSongsButton() {
  return (
    <Button asChild variant="outline" className="mt-6 mx-4 md:mx-0">
      <Link href="/played-songs">
        <ArrowLeft data-icon="inline-start" />
        Back to played songs
      </Link>
    </Button>
  );
}

interface SongPageProps {
  params: Promise<{ song: string }>;
}

const FALLBACK_ALBUM_ART =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

function VoteSummaryText({
  totalVotes,
  userVoted,
}: {
  totalVotes: number;
  userVoted: boolean;
}) {
  if (userVoted) {
    const others = totalVotes - 1;
    return (
      <p className="text-muted-foreground">
        You voted for this song
        {others > 0
          ? ` · ${others} other${others === 1 ? "" : "s"} voted this song`
          : " · No one else voted this song yet"}
      </p>
    );
  }

  if (totalVotes === 0) {
    return <p className="text-muted-foreground">No votes yet</p>;
  }

  return (
    <p className="text-muted-foreground">
      {totalVotes} {totalVotes === 1 ? "person" : "people"} voted this song
    </p>
  );
}

export default async function SongPage(props: SongPageProps) {
  const params = await props.params;
  const result = await getSongDetail(params.song);

  if (result.status === "unresolved") {
    return (
      <div className="w-full md:p-16">
        <Card className="p-3 m-4 md:m-0">
          <div className="flex flex-col md:flex-row md:gap-8">
            <Image
              className="rounded-lg"
              src={FALLBACK_ALBUM_ART}
              alt={result.title}
              width={500}
              height={500}
            />
            <div className="flex flex-col justify-between py-3 md:py-0 gap-4 md:gap-0">
              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl">{result.title}</h1>
                  <h2 className="text-lg md:text-2xl">{result.artist}</h2>
                </div>
                <p className="text-muted-foreground">
                  Couldn&apos;t load this song right now.
                </p>
              </div>
            </div>
          </div>
        </Card>
        <BackToPlayedSongsButton />
      </div>
    );
  }

  const { song } = result;
  const albumArt = song.albumArt || FALLBACK_ALBUM_ART;

  // Vote counts are only shown to logged-in users.
  const session = await auth.api.getSession({ headers: await headers() });
  const voteSummary = session?.user
    ? await getSongVoteSummary(
        song.id,
        new Date().getFullYear(),
        session.user.id,
      )
    : null;

  if (result.status === "not-played") {
    return (
      <div className="w-full md:p-16">
        <Card className="p-3 m-4 md:m-0">
          <div className="flex flex-col md:flex-row md:gap-8">
            <Image
              className="rounded-lg"
              src={albumArt}
              alt={song.title}
              width={500}
              height={500}
            />
            <div className="flex flex-col justify-between py-3 md:py-0 gap-4 md:gap-0">
              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-2xl md:text-3xl">{song.title}</h1>
                  <h2 className="text-lg md:text-2xl">{song.artist}</h2>
                </div>
                <p className="text-muted-foreground">
                  Hasn't aired on the countdown yet
                </p>
                {voteSummary && <VoteSummaryText {...voteSummary} />}
              </div>
            </div>
          </div>
        </Card>
        <BackToPlayedSongsButton />
      </div>
    );
  }

  const { rank, rankOneYearAgo, rankTwoYearsAgo } = result;
  const parsedRankOneYearAgo = parseInt(rankOneYearAgo, 10);
  const isNewEntry = Number.isNaN(parsedRankOneYearAgo);
  const calculatePlacesUpOrDown = isNewEntry
    ? 0
    : parsedRankOneYearAgo - rank;

  return (
    <div className="w-full md:p-16">
      <Card className="p-3 m-4 md:m-0">
        <div className="flex flex-col md:flex-row md:gap-8">
          <Image
            className="rounded-lg"
            src={albumArt}
            alt={song.title}
            width={500}
            height={500}
          />
          <div className="flex flex-col justify-between py-3 md:py-0 gap-4 md:gap-0">
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl">
                  <span className="text-red-400">{rank}:</span> {song.title}
                </h1>
                <h2 className="text-lg md:text-2xl">{song.artist}</h2>
              </div>
              <p className="text-muted-foreground">
                Album: {song.album}. Released in {song.releaseYear}
              </p>
              {voteSummary && <VoteSummaryText {...voteSummary} />}
              {isNewEntry ? (
                <div className="flex gap-3 text-muted-foreground md:text-xl items-center">
                  New entry <Sparkles size={24} />
                </div>
              ) : calculatePlacesUpOrDown > 0 ? (
                <div className="flex gap-3 text-green-500 md:text-xl items-center">
                  Up {calculatePlacesUpOrDown} <TrendingUp size={24} />
                </div>
              ) : (
                <div className="flex gap-3 text-red-500 text-lg md:text-2xl items-center">
                  Down {Math.abs(calculatePlacesUpOrDown)}{" "}
                  <TrendingDown size={24} />
                </div>
              )}
            </div>

            <div>
              <p className="text-muted-foreground">
                Last year: {rankOneYearAgo}
              </p>
              <p className="text-muted-foreground">
                Rank Two Years Ago: {rankTwoYearsAgo}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <BackToPlayedSongsButton />
    </div>
  );
}
