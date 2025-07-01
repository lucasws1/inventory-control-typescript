"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { redirect } from "next/navigation";
import { deleteStockMovement } from "../lib/actions";
import { DragHandle } from "../dataTable/data-table";

export const columns: ColumnDef<StockMovementTableData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    enableColumnFilter: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" className="w-full" />
    ),
    cell: ({ row }) => {
      const date = row.original.date;
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = (row.getValue(columnId) as Date).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");

      return `${day}${month}${year}`.includes(filterValue);
    },
  },
  {
    id: "product",
    accessorKey: "Product.name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Produto"
        className="w-full"
      />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Quantidade"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      return <div>{quantity}</div>;
    },
    filterFn: "inNumberRange",
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Motivo"
        className="w-full"
      />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const stockMovement = row.original;
      const handleDelete = async () => {
        await deleteStockMovement(stockMovement.id);
        redirect("/stock-movement");
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-5 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(stockMovement.id.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => redirect(`/stock-movement/${stockMovement.id}`)}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDelete()}
            >
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Valor</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("pt-br", {
  //       style: "currency",
  //       currency: "BRL",
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },
];
