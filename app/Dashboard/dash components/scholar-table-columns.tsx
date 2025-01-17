import { ColumnDef } from "@tanstack/react-table"
import { Scholar } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Note: This file will need to import the EditScholarDialog and DeleteScholarDialog components,
// which we'll create in separate files.

export const columns: ColumnDef<Scholar>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <button
        className="text-blue-600 hover:underline"
        onClick={() => {
          // This function will need to be implemented in the parent component
          // and passed down as a prop
        }}
      >
        {row.getValue("name")}
      </button>
    ),
  },
  {
    accessorKey: "axieId",
    header: "Axie ID",
    cell: ({ row }) => <div>{row.getValue("axieId")}</div>,
  },
  {
    accessorKey: "share.manager",
    header: "Manager Share",
    cell: ({ row }) => <div>{row.original.share.manager}%</div>,
  },
  {
    accessorKey: "share.scholar",
    header: "Scholar Share",
    cell: ({ row }) => <div>{row.original.share.scholar}%</div>,
  },
  {
    accessorKey: "winrate",
    header: "Win Rate",
    cell: ({ row }) => <div>{row.getValue("winrate") || '0'}%</div>,
  },
  {
    accessorKey: "slp",
    header: "SLP",
    cell: ({ row }) => <div>{row.getValue("slp") || '0'}</div>,
  },
  {
    accessorKey: "axs",
    header: "AXS",
    cell: ({ row }) => <div>{row.getValue("axs") || '0'}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const scholar = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

