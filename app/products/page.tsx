import prisma from "@/lib/prisma";
import { ProductsTableData } from "@/types/productsTableData";
import { Metadata } from "next";
import DataTableClient from "../_dataTable/page";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Produtos",
};

const Products = async () => {
  const products: ProductsTableData[] = await prisma.product.findMany({
    include: {
      StockMovement: true,
    },
  });

  return (
    <>
      <DataTableClient columns={columns} data={products} />
    </>
  );
};

export default Products;
