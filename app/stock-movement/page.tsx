import prisma from "@/lib/prisma";
import { StockMovementTableData } from "@/types/StockMovementWithRelations";
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
      <StockMovementClient />
    </>
  );
};

export default StockMovement;
