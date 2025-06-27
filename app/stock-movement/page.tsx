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
      include: {
        Product: true,
      },
    });

  const tableData = formatTableData(stockMovement, "stockMovement");

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />

      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default StockMovement;
