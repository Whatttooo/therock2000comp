import { DisplayAllPlayedSongs } from "@/components/display-all-played-songs/DisplayAllPlayedSongs";

import { getAllPlayedSongsWithArt } from "@/server/actions/actions";

export const revalidate = 300;

export default async function AllSongsPage() {
  const allPlayedSongs = await getAllPlayedSongsWithArt();
  console.log("hello")
  return <DisplayAllPlayedSongs songs={allPlayedSongs} />;
}
