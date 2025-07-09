"use client";
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
import { Customer } from "@/types/customer";
import { CustomerWithRelations } from "@/types/CustomerWithRelations";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { deleteCustomer } from "../lib/actions";
import { columns } from "./columns";
import OverlaySkeleton from "@/components/overlaySkeleton";

export default function CustomersWithModal() {
  const { openModal } = useModal();
  const { customers, loading, error, refreshData } = useData();

  const handleEditCustomer = (customer: Customer) => {
    openModal("edit-customer", customer);
  };

  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const customer = row.original;

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
        } as ColumnDef<CustomerWithRelations>;
      }
      return column;
    });
  }, [openModal, refreshData]);

  if (loading) {
    return (
      <div>
        <OverlaySkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Erro ao carregar clientes.</div>;
  }

  if (!customers || customers.length === 0) {
    return <div>Nenhum cliente encontrado.</div>;
  }

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTable columns={columnsWithModalEdit} data={customers} />
    </>
  );
}
