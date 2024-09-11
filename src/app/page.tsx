import { LeaderTable } from "@/components/leader-table/LeaderTable";
import { columns } from "@/components/leader-table/LeaderTableColumns";
import { getUsersForLeaderBoard } from "@/server/actions/actions";
import { Trophy } from "lucide-react";

export default async function Home() {
  const data = await getUsersForLeaderBoard();
  return (
    <div className="flex flex-col gap-11">
      <h1 className="text-2xl md:text-6xl font-bold">
        Welcome to the Rock 2000 🎸
      </h1>
      <h2 className="text-xl md:text-6xl font-bold text-muted-foreground">
        Scores on the doors:
      </h2>
      <div className="flex items-center w-full ">
        <LeaderTable columns={columns} data={data} />
      </div>
    </div>
  );
}
