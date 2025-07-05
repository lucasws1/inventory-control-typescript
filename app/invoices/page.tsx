import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const InvoicesWithModal = dynamic(() => import("./InvoicesWithModal"), {
  loading: () => <div>Carregando vendas...</div>,
});

export const metadata: Metadata = {
  title: "Vendas",
};

const Invoices = async () => {
  const [invoices, products] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: {
        purchaseDate: "desc",
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
    prisma.product.findMany(),
  ]);

  return (
    <div>
      <InvoicesWithModal
        invoices={invoices as InvoicesTableData[]}
        products={products as any[]}
      />
    </div>
  );
};

export default Invoices;
