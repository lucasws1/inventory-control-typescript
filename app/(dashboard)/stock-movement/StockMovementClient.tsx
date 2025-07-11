"use client";
import { useData } from "@/contexts/DataContext";
import OverlaySkeleton from "@/components/overlaySkeleton";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function StockMovementClient() {
  const { stockMovements, loading, error } = useData();

  if (loading) {
    return <OverlaySkeleton />;
  }

  if (error) {
    return <div>Erro ao carregar movimentações de estoque.</div>;
  }

  if (!stockMovements || stockMovements.length === 0) {
    return <div>Nenhuma movimentação de estoque encontrada.</div>;
  }

  return <DataTable columns={columns} data={stockMovements} />;
}
