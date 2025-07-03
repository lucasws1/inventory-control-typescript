import prisma from "@/lib/prisma";
import { Metadata } from "next";
import InvoiceEditForm from "./InvoiceEditForm";

const metadata: Metadata = {
  title: "Editar Venda",
};

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const [products, invoice] = await Promise.all([
    await prisma.product.findMany(),
    await prisma.invoice.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        customer: true,
        InvoiceItem: {
          include: {
            Product: true,
          },
        },
      },
    }),
  ]);

  if (!invoice) {
    throw new Error("Invoice not found - erro");
  }

  return (
    <InvoiceEditForm products={products as any} invoice={invoice as any} />
  );
}
