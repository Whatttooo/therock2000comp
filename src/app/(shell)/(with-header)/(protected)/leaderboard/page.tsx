import { LeaderTable } from "@/components/leader-table/LeaderTable";
import { columns } from "@/components/leader-table/LeaderTableColumns";
import { getLeaderboard } from "@/server/actions/leaderboardActions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LeaderboardPage() {
  const currentYear = new Date().getFullYear();
  const [data, session] = await Promise.all([
    getLeaderboard(currentYear),
    auth.api.getSession({ headers: await headers() }),
  ]);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-6">Leaderboard</h1>
      <LeaderTable columns={columns} data={data} currentUserId={session?.user.id} />
    </div>
  );
}
