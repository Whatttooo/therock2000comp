import { DisplayAllPlayedSongs } from "@/components/display-all-played-songs/DisplayAllPlayedSongs";
import { SongCard } from "@/components/song-card/SongCard";

import { getAllPlayedSongsWithArt } from "@/server/actions/actions";

export default async function AllSongsPage() {
  const allPlayedSongs = await getAllPlayedSongsWithArt();

  return <DisplayAllPlayedSongs songs={allPlayedSongs} />;
}
