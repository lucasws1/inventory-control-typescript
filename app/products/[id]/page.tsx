import prisma from "@/lib/prisma";
import ProductEditForm from "./ProductEditForm";
import { ProductWithRelations } from "@/types/ProductWithRelations";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product: ProductWithRelations | null = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      InvoiceItem: true,
      StockMovement: true,
    },
  });

  return (
    <div>
      <ProductEditForm product={product} />
    </div>
  );
}
