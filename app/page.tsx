"use server";

import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { formatTableData } from "@/utils/formatTableData";
import { Prisma } from "./generated/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";

const Home = async () => {
  const invoices: InvoicesTableData[] = await prisma.invoice.findMany({
    include: {
      customer: true,
      InvoiceItem: {
        include: {
          Product: true,
        },
      },
    },
  });

  const tableData = formatTableData(invoices as InvoicesTableData[]);

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />

      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Home;
