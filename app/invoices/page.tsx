import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Metadata } from "next";
import InvoicesWithModal from "./InvoicesWithModal";

export const metadata: Metadata = {
  title: "Faturas",
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
