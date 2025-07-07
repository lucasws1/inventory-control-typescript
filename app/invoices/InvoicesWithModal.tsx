"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OverlaySkeleton from "@/components/overlaySkeleton";
import { useData } from "@/contexts/DataContext";
import { useModal } from "@/contexts/ModalContext";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { deleteInvoice } from "../lib/actions";
import { columns } from "./columns";

export default function InvoicesWithModal() {
  const { openModal } = useModal();
  const { invoices, loading, error, refreshData } = useData();

  const handleEditInvoice = (invoice: InvoicesTableData) => {
    openModal("edit-invoice", invoice);
  };

  const handleDelete = async (invoice: InvoicesTableData) => {
    await deleteInvoice(invoice.id);
    await refreshData(); // Atualiza os dados após deletar
  };

  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const invoice = row.original;

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
                    <IconCopy />
                    <span>Copiar ID</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEditInvoice(invoice)}
                  >
                    <IconEdit />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDelete(invoice)}
                  >
                    <IconTrash />
                    <span>Deletar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        } as ColumnDef<InvoicesTableData>;
      }
      return column;
    });
  }, [handleEditInvoice, handleDelete]);

  if (loading) {
    return <OverlaySkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Erro: {error}
      </div>
    );
  }

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTable columns={columnsWithModalEdit} data={invoices} />
    </>
  );
}
