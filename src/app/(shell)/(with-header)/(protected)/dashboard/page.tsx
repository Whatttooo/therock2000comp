import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, PencilOff } from "lucide-react";
import {
  getUserVotesWithStatus,
  getUserProfileStats,
} from "@/server/actions/userActions";
import { SearchForSong } from "@/components/search-for-song/SearchForSong";
import { UserSongTable } from "@/components/user-song-table/UserSongTable";
import { columns } from "@/components/user-song-table/UserSongTableColumns";
import { UserProfileStatsCards } from "@/components/user-profile-stats/UserProfileStatsCards";

export default async function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { user } = session!;

  const userVotesWithStatus = await getUserVotesWithStatus(
    user.id,
    currentYear,
  );
  const voted = userVotesWithStatus.length > 0;
  const stats = voted
    ? await getUserProfileStats(user.id, currentYear, userVotesWithStatus)
    : null;

  return (
    <div className="flex flex-col gap-8  md:gap-16 md:p-16">
      <div className="w-full flex gap-4  px-6 md:px-0 md:flex-row md:gap-10 md:items-center">
        <UserAvatar className="md:h-40 md:w-40" user={user} />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl ">
            Welcome <span className="text-primary">{user.name}</span>
          </h1>
          {voted ? (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <BadgeCheck data-icon="inline-start" />
              Voted
            </Badge>
          ) : (
            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              <PencilOff data-icon="inline-start" />
              Not yet voted for {currentYear}
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full px-6 flex flex-col gap-6">
        {voted && stats ? (
          <>
            <UserProfileStatsCards stats={stats} />
            <UserSongTable columns={columns} data={userVotesWithStatus} />
          </>
        ) : (
          <SearchForSong currentYear={currentYear} />
        )}
      </div>
    </div>
  );
}
