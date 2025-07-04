"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { ColumnDef } from "@tanstack/react-table";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DataTableClient from "../_dataTable/page";
import { deleteCustomer } from "../lib/actions";
import { columns } from "./columns";
import CustomerEditForm from "./[id]/CustomerEditForm";
import { Customer } from "@/types/customer";
import { CustomerTableData } from "@/types/customerTableData";

export default function CustomersWithModal({
  customers,
}: {
  customers: Customer[];
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  // Modificar apenas a coluna de actions para usar nosso handler
  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const customer = row.original;

            const handleDelete = async () => {
              await deleteCustomer(customer.id);
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
                    <IconCopy />
                    <span>Copiar ID</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <IconEdit />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDelete()}
                  >
                    <IconTrash />
                    <span>Deletar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        } as ColumnDef<CustomerTableData>;
      }
      return column;
    });
  }, [router]);

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTableClient columns={columnsWithModalEdit} data={customers} />

      {/* Modal overlay */}
      {isModalOpen && selectedCustomer && (
        <CustomerEditForm
          customer={selectedCustomer as any}
          isModal={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
