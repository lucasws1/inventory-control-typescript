import prisma from "@/lib/prisma";
import StockMovementForm from "./StockMovementForm";

export default async function NewStockMovement() {
  const products: { id: number; name: string }[] =
    await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });

  return <StockMovementForm products={products} />;
}
