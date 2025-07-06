"use client";

import { ProductsTableData } from "@/types/productsTableData";
import ProductsWithModal from "./ProductsWithModal";

export default function ProductsClient({ products }: { products: any[] }) {
  return <ProductsWithModal products={products} />;
}
