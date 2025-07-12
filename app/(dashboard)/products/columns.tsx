"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

import { deleteProduct } from "@/app/lib/actions";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useData } from "@/contexts/DataContext";
import { useModal } from "@/contexts/ModalContext";
import { ProductWithRelations } from "@/types/ProductWithRelations";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<ProductWithRelations>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" className="w-full" />
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      return <div>{name}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço" className="w-full" />
    ),
    cell: ({ row }) => {
      const price = row.original.price;
      return (
        <div>
          {price
            ? price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "Preço não cadastrado"}
        </div>
      );
    },
    filterFn: "includesString",
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
    id: "Estoque",
    accessorKey: "StockMovement",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Estoque"
        className="w-full"
      />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground flex items-center gap-2 px-1.5"
      >
        {row.original.StockMovement.length > 0 ? (
          row.original.StockMovement.reduce(
            (acc, item) =>
              item.reason === "COMPRA" || item.reason === "AJUSTE_POSITIVO"
                ? acc + item.quantity
                : acc - item.quantity,
            0,
          )
        ) : (
          <span>0</span>
        )}
      </Badge>
    ),
    enableColumnFilter: false,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const { openModal } = useModal();
      const { refreshData } = useData();

      const handleEditProduct = () => {
        try {
          openModal("edit-product", product);
        } catch (error) {
          console.error("Erro ao abrir modal de edição:", error);
        }
      };

      const handleDelete = async () => {
        try {
          await deleteProduct(product.id);
          await refreshData();
        } catch (error) {
          console.error("Erro ao deletar produto:", error);
        }
      };

      const handleCopyId = async () => {
        try {
          await navigator.clipboard.writeText(product.id.toString());
        } catch (error) {
          console.error("Erro ao copiar ID:", error);
        }
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
            <DropdownMenuItem onClick={handleCopyId}>
              <IconCopy />
              <span>Copiar ID</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleEditProduct}
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
];
