"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { deleteCustomer } from "@/app/lib/actions";
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
import { CustomerWithRelations } from "@/types/CustomerWithRelations";
import {
  IconCircleCheckFilled,
  IconCopy,
  IconEdit,
  IconLoader,
  IconTrash,
} from "@tabler/icons-react";

type CustomerWithTotal = CustomerWithRelations & {
  totalAmount: number;
};

export const columns: ColumnDef<CustomerWithTotal>[] = [
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
      return <div>{phone ? phone : "Telefone não cadastrado"}</div>;
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
    accessorKey: "Invoice",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground flex items-center gap-2 px-1.5"
      >
        {row.original.Invoice ? (
          row.original.Invoice.find((item) => item.pending) ? (
            <IconLoader />
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
    id: "amount",
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <div className="flex w-full justify-end">
        <DataTableColumnHeader
          column={column}
          title="Valor"
          className="justify-end"
        />
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.original.totalAmount || 0;

      const formatted = new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
    filterFn: "includesString",
    meta: {
      className: "text-right",
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const { openModal } = useModal();
      const { refreshData } = useData();

      const handleEditCustomer = () => {
        openModal("edit-customer", customer);
      };

      const handleDelete = async () => {
        await deleteCustomer(customer.id);
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
                navigator.clipboard.writeText(customer.id.toString())
              }
            >
              <IconCopy />
              <span>Copiar ID</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleEditCustomer}
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
