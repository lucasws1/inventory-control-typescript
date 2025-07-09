import { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Produtos",
};

export const revalidate = 0;

const Products = () => {
  return <ProductsClient />;
};

export default Products;
