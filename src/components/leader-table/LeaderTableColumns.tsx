"use client";
import { ColumnDef } from "@tanstack/react-table";

import type { User } from "@/data/users";
import { users } from "@/data/users";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorFn: (row: User) => `${row.firstName} ${row.lastName}`,
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
  },
];
