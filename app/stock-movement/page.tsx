import prisma from "@/lib/prisma";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { Metadata } from "next";
import DataTableClient from "../dataTable/page";
import { columns } from "./columns";

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
      <DataTableClient columns={columns} data={stockMovement} />
    </>
  );
};

export default StockMovement;
