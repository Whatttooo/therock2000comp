"use client";
import {
  ColumnDef,
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserVoteWithStatus } from "@/server/actions/userActions";

// UserSongTable only sorts and global-filters, so only those two features
// are registered (rather than @tanstack/react-table's `stockFeatures`,
// which pulls in all 17 built-in features).
export const userSongTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
});

export const columns: ColumnDef<
  typeof userSongTableFeatures,
  UserVoteWithStatus
>[] = [
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4  rounded-md p-1 hover:bg-slate-800 cursor-pointer pl-0 w-fit"
        >
          Points
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    accessorKey: "points",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.points}</span>
    ),
  },
  {
    header: "Album Art",
    id: "albumArt",
    cell: ({ row }) =>
      row.original.albumArt ? (
        <Image
          src={row.original.albumArt}
          width={50}
          height={50}
          alt={`album art for ${row.original.title}`}
        />
      ) : null,
  },
  {
    header: "Song",
    accessorKey: "title",
  },
  {
    header: "Artist",
    accessorKey: "artist",
  },
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4 rounded-md p-1 hover:bg-slate-800 cursor-pointer pl-0 w-fit"
        >
          Position
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    accessorKey: "position",
    cell: ({ row }) =>
      row.original.position === null ? (
        "-"
      ) : (
        <span className="tabular-nums">{row.original.position}</span>
      ),
  },

  {
    header: "Top Pick",
    id: "isTopPick",
    cell: ({ row }) => (
      <Star
        className={cn(
          row.original.isTopPick && "fill-yellow-500 text-yellow-500",
        )}
        aria-label={row.original.isTopPick ? "Top pick" : undefined}
      />
    ),
  },
];
