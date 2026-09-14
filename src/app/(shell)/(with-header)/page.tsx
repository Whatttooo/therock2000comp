import { Button } from "@/components/ui/button";
import { NowPlayingHeader } from "@/components/now-playing/NowPlaying";
import { SongsPlayedChart } from "@/components/song-played-chart/SongsPlayedChart";
import {
  buildHomePageSongChartData,
  getTotalVoteCount,
} from "@/server/actions/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutDashboard, LogIn, Trophy, UserPlus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";

export const revalidate = 300;

export default async function Home() {
  // const data = await getUsersForLeaderBoard();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentYear = new Date().getFullYear();
  const { playedSongsCount, percentBackToCircle } =
    await buildHomePageSongChartData();
  const totalVotes = await getTotalVoteCount(currentYear);

  return (
    <div className="w-full md:p-16">
      <div className="flex flex-col items-center md:items-start md:max-w-[800px] mb-8 md:mb-20">
        <div className="mb-8 px-4">
          <h1 className="text-2xl mb-6 md:text-5xl">
            🎸 Rock <span className="text-primary font-bold">2000</span> voting
            competition!
          </h1>
          <h2 className="text-muted-foreground md:text-xl">
            Got the best taste in rock music? Put it to the test!
          </h2>
          <h2 className="text-muted-foreground md:text-lg">
            Check how your top songs rank in the Rock 2000!
          </h2>
        </div>
        {!session?.user ? (
          <div className="flex flex-col md:w-full px-4 w-full md:flex-row gap-4">
            <Button asChild className="w-full md:w-40 p-6 md:text-lg" size="lg">
              <Link href="/sign-up">
                <UserPlus data-icon="inline-start" />
                Sign up
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-40 p-6 md:text-lg"
              size="lg"
            >
              <Link href="/sign-in">
                <LogIn data-icon="inline-start" />
                Sign in
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:w-full px-4 w-full md:flex-row gap-4">
            <Button asChild className="w-full md:w-40 p-6 md:text-lg" size="lg">
              <Link href="/dashboard">
                <LayoutDashboard data-icon="inline-start" />
                Dashboard
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-40 p-6 md:text-lg"
              size="lg"
            >
              <Link href="/leaderboard">
                <Trophy data-icon="inline-start" />
                Leaderboard
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col px-3 md:px-0 items-stretch w-full md:flex-row gap-4 md:gap-14">
        <SongsPlayedChart
          endAngle={percentBackToCircle}
          chartData={[
            { songsPlayed: playedSongsCount, fill: "var(--color-primary)" },
          ]}
        />
        <Card className="w-full md:w-fit md:min-w-[220px]">
          <CardHeader className="pb-0 px-2 md:px-(--card-spacing)">
            <CardTitle>Total votes</CardTitle>
            <CardDescription>{currentYear}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-1 items-center">
            <p className="text-2xl md:text-3xl text-primary font-bold">
              {totalVotes.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
