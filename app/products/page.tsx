import prisma from "@/lib/prisma";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ProductsWithModal = dynamic(() => import("./ProductsWithModal"), {
  loading: () => <div>Carregando produtos...</div>,
});

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
