"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "../ui/button";
import { SongCardPicker } from "../song-card-picker/SongCardPicker";
import { searchSongs, Song } from "@/data/rock2000songs";

const formSchema = z.object({
  song: z.string().min(1),
});

interface SongEntryFormProps {}

export const SongEntryForm = ({}: SongEntryFormProps) => {
  const [searchedSongs, setSearchedSongs] = useState<Song[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      song: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const handleOnChange = useDebouncedCallback((songTerm) => {
    const songResults = searchSongs(songTerm);
    setSearchedSongs(songResults);
  }, 500);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-3 items-center my-2">
          <FormField
            control={form.control}
            name="song"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song pick</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Song or artist"
                    {...field}
                    onChange={(event) => {
                      handleOnChange(event.target.value);
                      field.onChange(event);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Select a song from the list that pops up
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="border-2 rounded-lg p-2 flex flex-col gap-2">
          {searchedSongs.length === 0 && (
            <div className="text-muted-foreground">
              No songs found - type in a song above and they will appear here
            </div>
          )}
          {searchedSongs.map((song: Song) => (
            <SongCardPicker key={song.SONG} song={song} />
          ))}
        </div>
      </form>
    </Form>
  );
};
