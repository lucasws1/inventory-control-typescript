"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StockMovement } from "@/types/stockMovement";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DataTableClient from "../_dataTable/page";
import { deleteStockMovement } from "../lib/actions";
import { columns } from "./columns";
import StockMovementEditForm from "./[id]/StockMovementEditForm";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { StockMovementTableData } from "@/types/stockMovementTableData";

export default function StockMovementWithModal({
  stockMovements,
}: {
  stockMovements: StockMovement[];
}) {
  const [selectedStockMovement, setSelectedStockMovement] =
    useState<StockMovement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleEditStockMovement = (stockMovement: StockMovement) => {
    setSelectedStockMovement(stockMovement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStockMovement(null);
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
        } as ColumnDef<StockMovementTableData>;
      }
      return column;
    });
  }, [router]);

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTableClient columns={columnsWithModalEdit} data={stockMovements} />

      {/* Modal overlay */}
      {isModalOpen && selectedStockMovement && (
        <StockMovementEditForm
          stockMovement={selectedStockMovement as any}
          isModal={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
