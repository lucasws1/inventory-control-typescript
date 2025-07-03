"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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
import { CustomerTableData } from "@/types/customerTableData";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { DragHandle } from "../_dataTable/data-table";
import { deleteInvoice } from "../lib/actions";

export const columns: ColumnDef<CustomerTableData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="E-mail"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return <div>{email ? email : "E-mail não cadastrado"}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Telefone"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone;
      return <div>{phone}</div>;
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
      const date = row.original.createdAt;
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = (row.getValue(columnId) as Date).toLocaleDateString("pt-BR");
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
      const date = row.original.updatedAt;
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = (row.getValue(columnId) as Date).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");
      return `${day}${month}${year}`.includes(filterValue);
    },
  },
  {
    accessorKey: "Invoice",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground flex items-center gap-2 px-1.5"
      >
        {row.original.Invoice ? (
          row.original.Invoice.find((item) => item.pending) ? (
            // If any invoice is pending, show loading icon
            <IconLoader className="animate-spin" />
          ) : (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          )
        ) : (
          "Nenhuma fatura"
        )}
        {row.original.Invoice.find((item) => item.pending)
          ? "Pendente"
          : "Pago"}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const amount = row.original.Invoice.reduce(
        (acc, invoice) => invoice.amount + acc,
        0,
      );
      // If amount is null or undefined, return a default value
      if (amount === null || amount === undefined) {
        return <div className="text-right font-medium">R$ 0,00</div>;
      }
      // If amount is not a number, return a default value
      if (isNaN(amount)) {
        return <div className="text-right font-medium">R$ 0,00</div>;
      }
      const formatted = new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        await deleteInvoice(customer.id);
        router.refresh();
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
                navigator.clipboard.writeText(customer.id.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/customer/${customer.id}`)}
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
];
