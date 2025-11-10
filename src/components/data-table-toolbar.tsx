"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter, X } from "lucide-react";

// 👇 type the optional column meta we use
type ColumnMeta = {
  label?: string;
};

type Props<TData> = {
  table: Table<TData>;
  /** Column key used for the simple search input (e.g., "name") */
  searchColumn?: string;
};

export function DataTableToolbar<TData>({ table, searchColumn }: Props<TData>) {
  const searchCol = searchColumn ? table.getColumn(searchColumn) : null;
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {searchCol ? (
          <>
            <Input
              placeholder={`Search ${searchColumn}...`}
              value={(searchCol.getFilterValue() as string) ?? ""}
              onChange={(e) => searchCol.setFilterValue(e.target.value)}
              className="max-w-xs"
            />
            {searchCol.getFilterValue() ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => searchCol.setFilterValue("")}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <ListFilter className="h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllLeafColumns()
              .filter((col) => col.getCanHide())
              .map((col) => {
                // ✅ use a typed cast instead of `any`
                const meta = col.columnDef.meta as ColumnMeta | undefined;
                const label =
                  meta?.label ??
                  (typeof col.columnDef.header === "string"
                    ? (col.columnDef.header as string)
                    : col.id);

                return (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    className="capitalize"
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {isFiltered ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  );
}
