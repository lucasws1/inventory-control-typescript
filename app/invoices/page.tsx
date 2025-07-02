import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { Metadata } from "next";
import DataTableClient from "../dataTable/page";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Faturas",
};

const Invoices = async () => {
  const invoices: InvoicesTableData[] = await prisma.invoice.findMany({
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
  });

  return (
    <div>
      <DataTableClient columns={columns} data={invoices} />
    </div>
  );
};

export default Invoices;
