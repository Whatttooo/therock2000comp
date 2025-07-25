import { LeaderTable } from "@/components/leader-table/LeaderTable";
import { columns } from "@/components/leader-table/LeaderTableColumns";

export const revalidate = 300;

export default async function Home() {
  // const data = await getUsersForLeaderBoard();
  return (
    <div className="flex flex-col gap-11">
      <div className="p-4">
        <h1 className="text-2xl md:text-6xl font-bold">
          Welcome to the Rock 2000 🎸
        </h1>
        <h2 className="text-xl md:text-6xl font-bold text-muted-foreground">
          Scores on the doors:
        </h2>
      </div>
      <div className="flex items-center w-full ">
        New things coming soon
        {/* <LeaderTable columns={columns} data={data} /> */}
      </div>
    </div>
  );
}
