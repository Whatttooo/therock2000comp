import { notFound } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, PencilOff } from "lucide-react";
import {
  getUserById,
  getUserVotesWithStatus,
  getUserProfileStats,
} from "@/server/actions/userActions";
import { UserSongTable } from "@/components/user-song-table/UserSongTable";
import { columns } from "@/components/user-song-table/UserSongTableColumns";
import { UserProfileStatsCards } from "@/components/user-profile-stats/UserProfileStatsCards";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const profileUser = await getUserById(userId);
  if (!profileUser) {
    notFound();
  }

  const currentYear = new Date().getFullYear();
  const userVotesWithStatus = await getUserVotesWithStatus(userId, currentYear);
  const voted = userVotesWithStatus.length > 0;
  const stats = voted
    ? await getUserProfileStats(userId, currentYear, userVotesWithStatus)
    : null;

  return (
    <div className="flex flex-col gap-8  md:gap-16 md:p-16">
      <div className="w-full flex gap-4  px-6 md:px-0 md:flex-row md:gap-10 md:items-center">
        <UserAvatar className="md:h-40 md:w-40" user={profileUser} />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl ">
            <span className="text-primary">{profileUser.name}</span>
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
          <p className="text-muted-foreground">This user hasn't voted yet.</p>
        )}
      </div>
    </div>
  );
}
