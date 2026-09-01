import { LeaderTable } from "@/components/leader-table/LeaderTable";
import { columns } from "@/components/leader-table/LeaderTableColumns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 300;

export default async function Home() {
  // const data = await getUsersForLeaderBoard();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-base md:text-2xl">
        Welcome back <span className="text-primary font-bold">Team</span> 🎸
      </h1>
      <h2>Log in coming soon...</h2>
    </div>
  );
}
