"use client";
import {
  ColumnDef,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import type { LeaderboardEntry } from "@/server/actions/leaderboardActions";
import { UserAvatar } from "../UserAvatar";

// LeaderTable only sorts, so only that feature is registered (rather than
// @tanstack/react-table's `stockFeatures`, which pulls in all 17 built-in
// features).
export const leaderTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export const columns: ColumnDef<typeof leaderTableFeatures, LeaderboardEntry>[] = [
  {
    header: "#",
    id: "rank",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.getDisplayIndex() + 1}</span>
    ),
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserAvatar className="h-8 w-8 rounded-full" user={row.original} />
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4 rounded-md p-1 pl-0 hover:bg-slate-800 cursor-pointer w-fit"
        >
          Points
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.points}</span>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 md:gap-4 rounded-md p-1 pl-0 hover:bg-slate-800 cursor-pointer w-fit"
        >
          No. Songs Played
          <ArrowUpDown className="h-4 w-4" />
        </div>
      );
    },
    accessorKey: "numberOfSongsPlayed",
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.numberOfSongsPlayed} / 20
      </span>
    ),
  },
];
