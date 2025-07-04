import prisma from "@/lib/prisma";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { Metadata } from "next";
import StockMovementWithModal from "./StockMovementWithModal";

export const metadata: Metadata = {
  title: "Estoque",
};

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
