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
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Erro: {error}
      </div>
    );
  }

  return <DataTable columns={columns} data={stockMovements} />;
}
