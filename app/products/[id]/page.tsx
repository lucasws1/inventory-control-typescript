import prisma from "@/lib/prisma";
import ProductEditForm from "./ProductEditForm";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product: { id: number; name: string; price: number } | null =
    await prisma.product.findUnique({
      where: { id: Number(id) },
    });

  return (
    <div>
      <ProductEditForm product={product} />
    </div>
  );
}
