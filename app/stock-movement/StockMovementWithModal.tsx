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
import { StockMovement } from "@/types/stockMovement";
import { StockMovementWithRelations } from "@/types/StockMovementWithRelations";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { deleteStockMovement } from "../lib/actions";
import { columns } from "./columns";
import OverlaySkeleton from "@/components/overlaySkeleton";

export default function StockMovementWithModal() {
  const { openModal } = useModal();
  const { stockMovements, loading, error, refreshData } = useData();

  const handleEditStockMovement = (stockMovement: StockMovement) => {
    openModal("edit-stock-movement", stockMovement);
  };

  // Modificar apenas a coluna de actions para usar nosso handler
  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const stockMovement = row.original;

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
                    onClick={() => handleEditStockMovement(stockMovement)}
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
        } as ColumnDef<StockMovementWithRelations>;
      }
      return column;
    });
  }, [openModal, refreshData]);

  if (loading) {
    return <OverlaySkeleton />;
  }

  if (error) {
    return <div>Erro ao carregar movimentações de estoque.</div>;
  }

  if (!stockMovements || stockMovements.length === 0) {
    return <div>Nenhuma movimentação de estoque encontrada.</div>;
  }

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTable columns={columnsWithModalEdit} data={stockMovements} />
    </>
  );
}
