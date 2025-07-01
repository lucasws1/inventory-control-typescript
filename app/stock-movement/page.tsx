import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Product } from "@/types/product";
import { ProductsTableData } from "@/types/productsTableData";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { formatTableData } from "@/utils/formatTableData";
import { Metadata } from "next";
import { DataTable } from "../dataTable/data-table";
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
    <div>
      <DataTable
        columns={columns}
        data={stockMovement as StockMovementTableData[]}
      />
    </div>
  );
};

export default StockMovement;
