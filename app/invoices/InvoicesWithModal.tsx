"use client";
import { useState, useMemo } from "react";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Invoice } from "@/types/invoice";
import { Product } from "@/types/product";
import DataTableClient from "../_dataTable/page";
import { columns } from "./columns";
import InvoiceEditForm from "./[id]/InvoiceEditForm";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { deleteInvoice } from "../lib/actions";
import { useRouter } from "next/navigation";

export default function InvoicesWithModal({
  invoices,
  products,
}: {
  invoices: InvoicesTableData[];
  products: Product[];
}) {
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoicesTableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleEditInvoice = (invoice: InvoicesTableData) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  // Modificar apenas a coluna de actions para usar nosso handler
  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const invoice = row.original;

            const handleDelete = async () => {
              await deleteInvoice(invoice.id);
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
                      navigator.clipboard.writeText(invoice.id.toString())
                    }
                  >
                    Copiar ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEditInvoice(invoice)}
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
        } as ColumnDef<InvoicesTableData>;
      }
      return column;
    });
  }, [router]);

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTableClient columns={columnsWithModalEdit} data={invoices} />

      {/* Modal overlay */}
      {isModalOpen && selectedInvoice && (
        <InvoiceEditForm
          invoice={selectedInvoice as any}
          products={products}
          isModal={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
