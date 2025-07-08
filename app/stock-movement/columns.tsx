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
import { deleteStockMovement } from "../lib/actions";
import { Badge } from "@/components/ui/badge";

// Componente para as ações da linha
function StockMovementActions({
  stockMovement,
}: {
  stockMovement: StockMovementWithRelations;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteStockMovement(stockMovement.id);
    router.refresh();
  };

  const handleEdit = () => {
    router.push(`/stock-movement/${stockMovement.id}`);
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
          onClick={() => handleEdit()}
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
}

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
      return <StockMovementActions stockMovement={row.original} />;
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
