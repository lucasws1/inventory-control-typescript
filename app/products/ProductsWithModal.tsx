"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/contexts/ModalContext";
import { Product } from "@/types/product";
import { ProductsTableData } from "@/types/productsTableData";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import DataTableClient from "../_dataTable/page";
import { deleteProduct } from "../lib/actions";
import { columns } from "./columns";

export default function ProductsWithModal({
  products,
}: {
  products: Product[];
}) {
  const { openModal } = useModal();
  const router = useRouter();

  const handleEditProduct = (product: Product) => {
    try {
      openModal("edit-product", product);
    } catch (error) {
      console.error("Erro ao abrir modal de edição:", error);
    }
  };

  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const product = row.original;

            const handleDelete = async () => {
              try {
                await deleteProduct(product.id);
                router.refresh();
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
                    onClick={() => handleEditProduct(product)}
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
        } as ColumnDef<ProductsTableData>;
      }
      return column;
    });
  }, [router, openModal]);

  if (!products || products.length === 0) {
    return <div>Nenhum produto encontrado.</div>;
  }

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTableClient columns={columnsWithModalEdit} data={products} />
    </>
  );
}
