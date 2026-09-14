import { getCurrentSongDetail } from "@/server/actions/actions";
import { ShowNowPlaying } from "../show-now-playing/ShowNowPlaying";

export async function NowPlayingHeader() {
  try {
    const initialSongDetail = await getCurrentSongDetail();
    return (
      <div className="flex min-w-0">
        <ShowNowPlaying initialData={initialSongDetail} />
      </div>
    );
  } catch {
    // Renders on every page via the root layout — if the currently playing
    // song can't be resolved (e.g. not yet on Spotify), hide the header
    // rather than take down the whole page with an unhandled error.
    return null;
  }
}
