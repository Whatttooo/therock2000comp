import { UserSongTable } from "@/components/user-song-table/UserSongTable";
import { columns } from "@/components/user-song-table/UserSongTableColumns";
import {
  getMostRecentlyPlayedSong,
  getUserById,
} from "@/server/actions/actions";
import { notFound } from "next/navigation";
import Image from "next/image";

interface UserPageProps {
  params: { id: string };
}

export const revalidate = 300;

export default async function UserPage({ params }: UserPageProps) {
  const user = await getUserById(parseInt(params.id));
  if (!user) return notFound();
  const latestPlayedSong = await getMostRecentlyPlayedSong(user.songs);
  return (
    <>
      <div className="p-6 md:p-0">
        <h1 className="text-2xl md:text-6xl font-bold">
          {user.firstName} {user.lastName} Song table 🎸
        </h1>
        <div className="text-2xl mt-10">
          <h2>
            Total points: <span className="text-red-400">{user.points}</span>
          </h2>
          <h2>
            Number of songs played:{" "}
            <span className="text-red-400">{user.numberOfSongsPlayed}</span>{" "}
          </h2>
        </div>
        <div className="flex text-2xl items-center mt-10 flex-wrap md:flex-nowrap gap-2 md:gap-4 ">
          <h2>
            Last song to play:{" "}
            <span className="text-red-400">{latestPlayedSong.SONG}</span>{" "}
          </h2>
          <h2>
            By: <span className="text-red-400">{latestPlayedSong.ARTIST}</span>{" "}
          </h2>

          <h2 className="">
            played at{" "}
            <span className="text-red-400">{latestPlayedSong.PLAYED_AT}</span>
          </h2>
          <Image
            src={latestPlayedSong.ARTWORK}
            width={50}
            height={50}
            alt="album art of latest song played"
          />
        </div>
      </div>
      <div className="flex items-center w-full mt-6 md:mt-14">
        <UserSongTable columns={columns} data={user.songs} />
      </div>
    </>
  );
}
