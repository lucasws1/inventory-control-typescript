import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { formatTableData } from "@/utils/formatTableData";
import { Metadata } from "next";

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

  const tableData = formatTableData(invoices, "invoice");

  return (
    <div>
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Invoices;
