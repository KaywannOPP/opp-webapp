"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type Player = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  roles: string[];
};

export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    meta: { label: "Player" },
    header: ({ column }) => (
      <button
        className="font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label="Sort by player"
      >
        Player
      </button>
    ),
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            {p.avatar && <AvatarImage src={p.avatar} alt={p.name} />}
            <AvatarFallback>{p.initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{p.name}</span>
        </div>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "email",
    meta: { label: "Email" },
    header: ({ column }) => (
      <button
        className="font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        aria-label="Sort by email"
      >
        Email
      </button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "roles",
    header: "Roles",
    meta: { label: "Roles" },
    cell: ({ row }) =>
      row.original.roles.length ? (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.map((role) => (
            <Badge key={role}>{role}</Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    enableSorting: false,
  },
];
