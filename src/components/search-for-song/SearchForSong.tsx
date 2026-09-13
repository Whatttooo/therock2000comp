"use client";

import { searchSpotifyTracks, SpotifySearchResult } from "@/lib/spotify";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { SubmitConfirmation } from "./SubmitConfirmation";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus, Send, Star, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { submitUserVotes } from "@/server/actions/userActions";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

interface SearchForSongProps {
  currentYear: number;
}

export const SearchForSong = ({ currentYear }: SearchForSongProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const isMobile = useIsMobile();
  const [selectedSongs, setSelectedSongs] = useState<SpotifySearchResult[]>([]);
  const [favouriteSongId, setFavouriteSongId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data, error, isLoading } = useQuery<SpotifySearchResult[]>({
    queryKey: ["searchForSong", debouncedSearchTerm],
    queryFn: () => searchSpotifyTracks(debouncedSearchTerm),
  });

  const favouriteSong = selectedSongs.find(
    (song) => song.spotifyId === favouriteSongId,
  );

  const queryClient = useQueryClient();
  const { mutate: submitVotes, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      const res = await submitUserVotes(
        selectedSongs,
        currentYear,
        favouriteSongId,
      );

      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["searchForSong", debouncedSearchTerm],
      });
      router.push("/dashboard");
      router.refresh();
    },
    onError: (err: any) => {
      setServerError(err.message || "An unexpected error occurred.");
    },
  });

  const handleAddSong = (song: SpotifySearchResult) => {
    if (
      !selectedSongs.some(
        (selectedSong) => selectedSong.spotifyId === song.spotifyId,
      ) &&
      selectedSongs.length < 20
    ) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const songPicked = (song: SpotifySearchResult) =>
    selectedSongs.some(
      (selectedSong) => selectedSong.spotifyId === song.spotifyId,
    );

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return "Submitting...";
    }
    if (selectedSongs.length !== 20) {
      return "Must have 20 songs";
    }
    return "Submit Votes";
  };

  return (
    <div className="flex gap-2 px-6 flex-col-reverse md:flex-row">
      <div className="flex flex-col gap-2 md:gap-7 md:max-w-[1100px]">
        <div>
          <h2 className="text-lg md:text-2xl ">
            Search for a song and add it to your votes for the year
          </h2>
          <p className="text-muted-foreground">
            Please be aware that this is querying spotify and give you any
            possible song. Choose carefully.
          </p>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search a song..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
        {error && (
          <div className="text-red-500">An error occurred: {error.message}</div>
        )}
        {serverError && (
          <div className="bg-red-950/40 border border-red-800/40 text-red-200 text-sm p-4 rounded-xl font-medium">
            {serverError}
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col gap-7">
            <div className="flex items-center py-4">
              <Skeleton className="max-w-sm h-10" />
            </div>
            <div className="flex gap-3 md:gap-5 flex-wrap">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="w-full md:w-64 h-64" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex p-3 rounded-md md:p-2 gap-3 md:gap-5 flex-wrap justify-center md:justify-start ">
            {Array.isArray(data) && data.length > 0 ? (
              data
                .filter((song) => !songPicked(song))
                .map((song) =>
                  isMobile ? (
                    <div
                      key={song.spotifyId}
                      className="flex gap-3 items-center bd-secondary border rounded-lg w-full p-3"
                    >
                      <Image
                        className="rounded-lg w-16 h-16"
                        src={song.albumArt}
                        width={64}
                        height={64}
                        alt="album art of selected song"
                      />
                      <div className="flex flex-col justify-center">
                        <p>{song.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <Button
                          className={cn(
                            "cursor-pointer",
                            songPicked(song) &&
                              "opacity-50 bg-secondary cursor-not-allowed",
                          )}
                          onClick={() => handleAddSong(song)}
                        >
                          {!songPicked(song) && (
                            <Plus data-icon="inline-start" />
                          )}
                          {songPicked(song) ? "Song added" : "Add"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Card
                      key={song.spotifyId}
                      className="flex flex-col justify-center md:items-center md:justify-between w-full  md:w-fit md:max-w-64 cursor-pointer"
                    >
                      <CardHeader className="p-2 min-w-[250px] min-h-[250px]">
                        <Image
                          className="rounded-lg w-full h-auto"
                          src={song.albumArt}
                          width={250}
                          height={250}
                          alt="album art of current song"
                        />
                      </CardHeader>
                      <CardContent className="w-full self-start">
                        <div className="flex flex-col gap-2 md:gap-4">
                          <h2 className="text-xl font-semibold">
                            {song.title}
                          </h2>
                          <div className="flex gap-4 justify-between">
                            <h3 className="text-base font-semibold text-wrap text-muted-foreground">
                              by {song.artist}
                            </h3>
                            <h3 className="text-base font-semibold text-muted-foreground">
                              {song.releaseYear}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="w-full">
                        <div className="flex justify-end w-full">
                          <Button
                            className={cn(
                              "w-full cursor-pointer",
                              songPicked(song) &&
                                "opacity-50 bg-secondary cursor-not-allowed",
                            )}
                            onClick={() => handleAddSong(song)}
                          >
                            {!songPicked(song) && (
                              <Plus data-icon="inline-start" />
                            )}
                            {songPicked(song) ? "Song added" : "Add to Votes"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ),
                )
            ) : (
              <div className="ml-4 text-muted-foreground">No songs found</div>
            )}
          </div>
        )}
      </div>
      <Separator
        className="md:mx-5"
        orientation={isMobile ? "horizontal" : "vertical"}
      />
      <div className="flex flex-col p-4 gap-3 md:gap-5 bg-muted rounded-md w-full min-h-20 min-w-20 md:max-w-[500px] max-h-[50vh] md:max-h-[70vh]">
        <p className="text-muted-foreground">
          You have selected {selectedSongs.length} out of 20 songs.
        </p>
        <p className="text-muted-foreground text-sm">
          OPTIONAL: Click the star to mark a song as your Top Song. If it ranks
          the highest, DOUBLE points. If it doesn't, zero points.
        </p>
        {selectedSongs.length > 0 && (
          <div className="flex flex-wrap content-start gap-2 flex-1 overflow-y-auto themed-scrollbar">
            {selectedSongs.map((song) => (
              <div
                key={song.spotifyId}
                className="flex gap-3 items-center bd-secondary rounded-sm w-full p-3 border-b"
              >
                <Image
                  className="rounded-lg w-16 h-16"
                  src={song.albumArt}
                  width={64}
                  height={64}
                  alt="album art of selected song"
                />
                <div className="flex flex-col justify-center min-w-0">
                  <p className="truncate">{song.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {song.artist}
                  </p>
                </div>
                <div className="flex-1 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className={cn(
                      "cursor-pointer",
                      favouriteSongId === song.spotifyId && "text-yellow-500",
                    )}
                    onClick={() =>
                      setFavouriteSongId(
                        favouriteSongId === song.spotifyId
                          ? null
                          : song.spotifyId,
                      )
                    }
                    title="Pick as favourite (worth double points if it's your highest-charting song, zero if it isn't)"
                  >
                    <Star
                      className={cn(
                        favouriteSongId === song.spotifyId && "fill-yellow-500",
                      )}
                    />
                  </Button>
                  <Button
                    className="btn-secondary cursor-pointer"
                    // size="lg"
                    onClick={() => {
                      setSelectedSongs(
                        selectedSongs.filter(
                          (selectedSong) =>
                            selectedSong.spotifyId !== song.spotifyId,
                        ),
                      );
                      if (favouriteSongId === song.spotifyId) {
                        setFavouriteSongId(null);
                      }
                    }}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          disabled={selectedSongs.length !== 20 || isSubmitting}
          className="w-full md:w-auto btn-primary cursor-pointer"
          onClick={() => setIsConfirmOpen(true)}
        >
          {isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Send data-icon="inline-start" />
          )}
          {getSubmitButtonText()}
        </Button>
      </div>

      <SubmitConfirmation
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        favouriteSong={favouriteSong}
        onConfirm={submitVotes}
      />
    </div>
  );
};
