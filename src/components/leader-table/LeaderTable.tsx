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
import { cn } from "@/lib/utils";
import { leaderTableFeatures } from "./LeaderTableColumns";

interface LeaderTableProps<
  TData extends Record<string, unknown> & { id: string },
> {
  columns: ColumnDef<typeof leaderTableFeatures, TData>[];
  data: TData[];
  currentUserId?: string;
}

export const LeaderTable = <
  TData extends Record<string, unknown> & { id: string },
>({
  columns,
  data,
  currentUserId,
}: LeaderTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: true },
  ]);
  const router = useRouter();

  const table = useTable({
    data,
    columns,
    features: leaderTableFeatures,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-lg border-1 w-full md:text-xl">
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
              className={cn(
                "cursor-pointer",
                row.original.id === currentUserId &&
                  "bg-primary/10 font-semibold",
              )}
              onClick={() => router.push(`/profiles/${row.original.id}`)}
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
  );
};
