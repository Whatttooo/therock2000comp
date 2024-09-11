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
        <div className="flex items-center gap-2 md:gap-4">
          Points
          <Button
            className="max-w-fit"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 md:gap-4">
          Number of Songs Played
          <Button
            className="max-w-fit"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    accessorKey: "numberOfSongsPlayed",
  },
];
