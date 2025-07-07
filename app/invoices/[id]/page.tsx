import { Metadata } from "next";
import InvoiceEditForm from "./InvoiceEditForm";
import { useData } from "@/contexts/DataContext";

const metadata: Metadata = {
  title: "Editar Venda",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { products, invoices } = useData();
  const { id } = await params;

  const invoice = invoices.find((invoice) => invoice.id === Number(id));
  console.log(invoice);

  // const [products, invoice] = await Promise.all([
  //   await prisma.product.findMany(),
  //   await prisma.invoice.findUnique({
  //     where: {
  //       id: Number(id),
  //     },
  //     include: {
  //       customer: true,
  //       InvoiceItem: {
  //         include: {
  //           Product: true,
  //         },
  //       },
  //     },
  //   }),
  // ]);

  if (!invoice) {
    throw new Error("Invoice not found - erro");
  }

  return (
    <InvoiceEditForm products={products as any} invoice={invoice as any} />
  );
}
