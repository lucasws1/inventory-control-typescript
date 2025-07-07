import prisma from "@/lib/prisma";
import { Customer } from "@/types/customer";
import { Metadata } from "next";
import CustomerEditForm from "./CustomerEditForm";

export const metadata: Metadata = {
  title: "Editar Cliente",
};

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">
      <CustomerEditForm customer={customer as Customer} />
    </div>
  );
}
