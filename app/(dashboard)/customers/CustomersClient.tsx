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
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Erro: {error}
      </div>
    );
  }

  const customersWithTotal = customers.map((customer) => {
    return {
      ...customer,
      totalAmount: customer.Invoice.reduce(
        (acc, invoice) => acc + (invoice.amount || 0),
        0,
      ),
    };
  });

  return <DataTable columns={columns} data={customersWithTotal} />;
}
