import prisma from "@/lib/prisma";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { Metadata } from "next";
import StockMovementClient from "./StockMovementClient";

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
      <StockMovementClient stockMovements={stockMovement as any[]} />
    </>
  );
};

export default StockMovement;
