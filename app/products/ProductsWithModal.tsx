"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DataTableClient from "../_dataTable/page";
import { deleteProduct } from "../lib/actions";
import { columns } from "./columns";
import ProductEditForm from "./[id]/ProductEditForm";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { ProductsTableData } from "@/types/productsTableData";

export default function ProductsWithModal({
  products,
}: {
  products: Product[];
}) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Modificar apenas a coluna de actions para usar nosso handler
  const columnsWithModalEdit = useMemo(() => {
    return columns.map((column) => {
      if (column.id === "actions") {
        return {
          ...column,
          cell: ({ row }: any) => {
            const product = row.original;

            const handleDelete = async () => {
              await deleteProduct(product.id);
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
                      navigator.clipboard.writeText(product.id.toString())
                    }
                  >
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
                    onClick={() => handleDelete()}
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
  }, [router]);

  return (
    <>
      {/* Tabela sempre visível */}
      <DataTableClient columns={columnsWithModalEdit} data={products} />

      {/* Modal overlay */}
      {isModalOpen && selectedProduct && (
        <ProductEditForm
          product={selectedProduct as any}
          isModal={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
