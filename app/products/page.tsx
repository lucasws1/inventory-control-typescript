import prisma from "@/lib/prisma";
import { Metadata } from "next";
import ProductsWithModal from "./ProductsWithModal";

export const metadata: Metadata = {
  title: "Produtos",
};

const Products = async () => {
  const products = await prisma.product.findMany({
    include: {
      StockMovement: true,
    },
  });

  return <ProductsWithModal products={products as any[]} />;
};

export default Products;
