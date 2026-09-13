import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SongsPlayedChart } from "@/components/song-played-chart/SongsPlayedChart";
import { cn } from "@/lib/utils";
import type { UserProfileStats } from "@/server/actions/userActions";

const FALLBACK_ALBUM_ART =
  "https://images.mediaworks.nz/therock/Content/apps/theme/images/therock_square4x.png?width=400&height=400&crop=auto";

interface UserProfileStatsCardsProps {
  stats: UserProfileStats;
}

export function UserProfileStatsCards({ stats }: UserProfileStatsCardsProps) {
  const {
    leaderboardRank,
    totalPoints,
    songsPlayedCount,
    totalSongsVoted,
    topPick,
  } = stats;
  const endAngle =
    totalSongsVoted > 0 ? (songsPlayedCount / totalSongsVoted) * 360 + 90 : 90;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card size="sm">
        <CardHeader className="pb-0 px-2 md:px-(--card-spacing)">
          <CardTitle className=" text-sm md:text-base">
            Leaderboard rank
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 md:justify-center items-center">
          <p className="text-xl md:text-4xl text-primary font-bold">
            {leaderboardRank !== null ? `#${leaderboardRank}` : "Unranked"}
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-0 px-2 md:px-(--card-spacing)">
          <CardTitle className="text-sm md:text-base">Points</CardTitle>
        </CardHeader>
        <CardContent className="flex md:justify-center flex-1 items-center">
          <p className="text-xl md:text-4xl text-primary font-bold">
            {totalPoints.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <SongsPlayedChart
        size="compact"
        endAngle={endAngle}
        chartData={[
          { songsPlayed: songsPlayedCount, fill: "var(--color-primary)" },
        ]}
      />

      <Card
        size="sm"
        className={cn(
          topPick?.outcome === "worked" &&
            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
          topPick?.outcome === "didnt-work" &&
            "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        )}
      >
        <CardHeader className="pb-0">
          <CardTitle className="text-sm md:text-base">Top pick</CardTitle>
        </CardHeader>
        <CardContent className="flex md:justify-center flex-1 items-center">
          {topPick ? (
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <Image
                src={topPick.albumArt || FALLBACK_ALBUM_ART}
                alt={`album art for ${topPick.title}`}
                width={64}
                height={64}
                className="rounded-md shrink-0 w-16 h-16 md:w-24 md:h-24"
              />
              <div className="min-w-0">
                <p className="truncate text-sm md:text-xl font-medium">
                  {topPick.title}
                </p>
                <p className="truncate text-xs md:text-base opacity-80">
                  {topPick.artist}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No top pick chosen</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
