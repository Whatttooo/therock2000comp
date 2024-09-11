import { Song } from "@/data/rock2000songs";
import Image from "next/image";
import { Button } from "../ui/button";

interface SongCardPickerProps {
  song: Song;
  buttonType?: "add" | "remove";
  onClick?: () => void;
}

export const SongCardPicker = ({
  song,
  buttonType = "add",
  onClick,
}: SongCardPickerProps) => {
  return (
    <div className="p-2 flex border-2 rounded-2xl justify-between items-center gap-2">
      <div className="flex items-center gap-16">
        <Image
          className="rounded-2xl"
          src={song.ARTWORK}
          alt={song.SONG}
          width={100}
          height={100}
        />
        <p>{song.SONG}</p>
        <p>{song.ARTIST}</p>
      </div>
      {buttonType === "add" ? (
        <Button
          className="bg-green-600 h-16 w-16 text-2xl text-white hover:bg-green-700"
          type="submit"
        >
          +
        </Button>
      ) : (
        <Button
          onClick={onClick}
          className="bg-red-600 h-16 w-16 text-2xl text-white hover:bg-green-700"
        >
          -
        </Button>
      )}
    </div>
  );
};
