import prisma from "@/lib/prisma";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const StockMovementWithModal = dynamic(
  () => import("./StockMovementWithModal"),
);

export const metadata: Metadata = {
  title: "Estoque",
};

export const revalidate = 0;

const StockMovement = async () => {
  const stockMovement: StockMovementTableData[] =
    await prisma.stockMovement.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        Product: true,
      },
    });

  return (
    <>
      <StockMovementWithModal stockMovements={stockMovement as any[]} />
    </>
  );
};

export default StockMovement;
