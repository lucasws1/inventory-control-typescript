"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { StockMovementWithRelations } from "@/types/StockMovementWithRelations";
import { deleteStockMovement } from "@/app/lib/actions";
import { Badge } from "@/components/ui/badge";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { useModal } from "@/contexts/ModalContext";
import { useData } from "@/contexts/DataContext";

export const columns: ColumnDef<StockMovementWithRelations>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
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
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" className="w-full" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = new Date(
        row.getValue(columnId) as string,
      ).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");

      return `${day}${month}${year}`.includes(filterValue);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Criado em"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = new Date(
        row.getValue(columnId) as string,
      ).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");

      return `${day}${month}${year}`.includes(filterValue);
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Atualizado em"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = new Date(
        row.getValue(columnId) as string,
      ).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");
      return `${day}${month}${year}`.includes(filterValue);
    },
  },

  {
    accessorKey: "reason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" className="w-full" />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.reason}
          </Badge>
        </div>
      );
    },
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
    id: "actions",
    cell: ({ row }) => {
      const stockMovement = row.original;
      const { openModal } = useModal();
      const { refreshData } = useData();

      const handleEditStockMovement = () => {
        openModal("edit-stock-movement", stockMovement);
      };

      const handleDelete = async () => {
        await deleteStockMovement(stockMovement.id);
        await refreshData();
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
              <IconCopy />
              <span>Copiar ID</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleEditStockMovement}
            >
              <IconEdit />
              <span>Editar</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              <IconTrash />
              <span>Deletar</span>
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
