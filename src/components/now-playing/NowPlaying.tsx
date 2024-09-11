import { getCurrentSong } from "@/server/actions/actions";
import { ShowNowPlaying } from "../show-now-playing/ShowNowPlaying";

export async function NowPlayingHeader() {
  const initialSongData = await getCurrentSong();

  return (
    <div className="w-full p-3 flex border-b-2 md:min-h-20">
      <ShowNowPlaying initialData={initialSongData} />
    </div>
  );
}
