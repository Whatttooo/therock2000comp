"use client";
import {
  ColumnDef,
  flexRender,
  SortingState,
  useTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { userSongTableFeatures } from "./UserSongTableColumns";

interface UserSongTableProps<
  TData extends Record<string, unknown> & { id: string },
> {
  columns: ColumnDef<typeof userSongTableFeatures, TData>[];
  data: TData[];
}

export const UserSongTable = <
  TData extends Record<string, unknown> & { id: string },
>({
  columns,
  data,
}: UserSongTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: true },
  ]);
  const [filtering, setFiltering] = useState("");
  const router = useRouter();

  const table = useTable({
    data,
    columns,
    features: userSongTableFeatures,
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      globalFilter: filtering,
    },
  });

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter songs..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-lg border-1 m-0 md:m-1 md:w-full md:text-xl ">
        <Table className="md:text-lg">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                onClick={() => router.push(`/played-songs/${row.original.id}`)}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
