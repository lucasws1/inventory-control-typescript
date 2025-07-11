"use client";
import { useData } from "@/contexts/DataContext";
import OverlaySkeleton from "@/components/overlaySkeleton";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function CustomersClient() {
  const { customers, loading, error } = useData();

  if (loading) {
    return <OverlaySkeleton />;
  }

  if (error) {
    return <div>Erro ao carregar clientes.</div>;
  }

  if (!customers || customers.length === 0) {
    return <div>Nenhum cliente encontrado.</div>;
  }

  return <DataTable columns={columns} data={customers} />;
}
