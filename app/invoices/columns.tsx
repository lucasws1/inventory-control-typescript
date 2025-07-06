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
import { InvoicesTableData } from "@/types/invoicesTableData";
import { useRouter } from "next/navigation";
import { DragHandle } from "../_dataTable/data-table";
import { deleteInvoice } from "../lib/actions";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";

export const columns: ColumnDef<InvoicesTableData>[] = [
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
    accessorKey: "purchaseDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" className="w-full" />
    ),
    cell: ({ row }) => {
      const date = row.original.purchaseDate;
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const date = (row.getValue(columnId) as Date).toLocaleDateString("pt-BR");
      const [day, month, year] = date.split("/");

      return `${day}${month}${year}`.includes(filterValue);
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Cliente"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      return <div>{row.original.customer.name}</div>;
    },
    filterFn: "includesString",
  },
  {
    id: "product",
    accessorKey: "InvoiceItem",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Produto"
        className="w-full"
      />
    ),
    cell: ({ row }) => {
      const product = row.original.InvoiceItem.map((item) => (
        <div key={item.id} className="flex gap-2">
          <Badge variant="outline" className="text-muted-foreground">
            {item.quantity}x {item.Product.name}
          </Badge>
        </div>
      ));

      return <div className="flex gap-2">{product}</div>;
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "pending",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-muted-foreground flex items-center gap-2 px-1.5"
      >
        {row.original.pending ? (
          <IconLoader />
        ) : (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        )}
        {row.original.pending ? "Pendente" : "Pago"}
      </Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
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
      const invoice = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        await deleteInvoice(invoice.id);
        router.refresh();
      };

      const handleEdit = () => {
        // Navega para a mesma página com o parâmetro edit
        router.push(`/invoices/${invoice.id}`);
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
                navigator.clipboard.writeText(invoice.id.toString())
              }
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
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
