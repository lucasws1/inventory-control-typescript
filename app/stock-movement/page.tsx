import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Product } from "@/types/product";
import { ProductsTableData } from "@/types/productsTableData";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { formatTableData } from "@/utils/formatTableData";
import { Metadata } from "next";

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

  const tableData = formatTableData(stockMovement, "stockMovement");

  return (
    <div>
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default StockMovement;
