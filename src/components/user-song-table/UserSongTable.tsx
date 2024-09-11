"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
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

interface UserSongTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const UserSongTable = <TData, TValue>({
  columns,
  data,
}: UserSongTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "PLAYED_AT", desc: false },
  ]);
  const [filtering, setFiltering] = useState("");
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setFiltering,
    getFilteredRowModel: getFilteredRowModel(),
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
      <div className="rounded-md border-4 w-full text-2xl ">
        <Table className="text-lg">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="font-bold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  if (row.getValue("PLAYED_AT") === undefined) return;
                  router.push(`/played-songs/${row.getValue("PLAYED_AT")}`);
                }}
              >
                {row.getVisibleCells().map((cell) => (
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
