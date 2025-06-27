import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { ProductsTableData } from "@/types/productsTableData";
import { formatTableData } from "@/utils/formatTableData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produtos",
};

const Products = async () => {
  const products: ProductsTableData[] = await prisma.product.findMany({
    include: {
      StockMovement: true,
    },
  });

  const tableData = formatTableData(products, "product");

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Products;
