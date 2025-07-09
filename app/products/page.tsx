import { Metadata } from "next";
import ProductsWithModal from "./ProductsWithModal";

export const metadata: Metadata = {
  title: "Produtos",
};

export const revalidate = 0;

const Products = () => {
  return <ProductsWithModal />;
};

export default Products;
