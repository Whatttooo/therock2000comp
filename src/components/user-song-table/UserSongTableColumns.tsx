"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Song } from "@/data/rock2000songs";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Song>[] = [
  {
    header: "Song",
    accessorKey: "SONG",
  },
  {
    header: "Artist",
    accessorKey: "ARTIST",
  },
  {
    header: "Album",
    accessorKey: "ARTWORK",
    cell: ({ row }) => (
      <Image
        src={row.getValue("ARTWORK")}
        width={50}
        height={50}
        alt={`album art for ${row.getValue("SONG")}`}
      />
    ),
  },
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4 rounded-md p-1 hover:bg-slate-800 cursor-pointer pl-0 w-fit"
        >
          Rank
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    accessorKey: "PLAYED_AT",
  },
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4 rounded-md p-1 hover:bg-slate-800 cursor-pointer pl-0 w-fit"
        >
          Points
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    accessorKey: "POINTS",
  },
];
