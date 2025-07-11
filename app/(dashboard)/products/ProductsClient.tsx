"use client";
import { useData } from "@/contexts/DataContext";
import OverlaySkeleton from "@/components/overlaySkeleton";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function ProductsClient() {
  const { products, loading, error } = useData();

  if (loading) {
    return <OverlaySkeleton />;
  }

  if (error) {
    return <div>Erro ao carregar produtos.</div>;
  }

  if (!products || products.length === 0) {
    return <div>Nenhum produto encontrado.</div>;
  }

  return <DataTable columns={columns} data={products} />;
}
