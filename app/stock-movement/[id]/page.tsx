import prisma from "@/lib/prisma";
import { Metadata } from "next";
import StockMovementEditForm from "./StockMovementEditForm";
import { StockMovement } from "@/types/stockMovement";

export const metadata: Metadata = {
  title: "Editar Estoque",
};
export default async function StockMovementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const stockMovement = await prisma.stockMovement.findUnique({
    where: { id: Number(id) },
    include: { Product: true },
  });

  return (
    <StockMovementEditForm
      stockMovement={stockMovement as unknown as StockMovement}
    />
  );
}
