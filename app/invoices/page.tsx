import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Metadata } from "next";
import InvoicesClient from "./InvoicesClient";

export const metadata: Metadata = {
  title: "Vendas",
};

export const revalidate = 0;
const Invoices = async () => {
  const [invoices] = await Promise.all([
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
  ]);

  return (
    <div>
      <InvoicesClient invoices={invoices as InvoicesTableData[]} />
    </div>
  );
};

export default Invoices;
