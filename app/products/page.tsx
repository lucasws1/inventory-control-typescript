import prisma from "@/lib/prisma";
import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Produtos",
};

export const revalidate = 0;

const Products = async () => {
  const products = await prisma.product.findMany({
    include: {
      StockMovement: true,
    },
  });

  return <ProductsClient products={products as any[]} />;
};

export default Products;
