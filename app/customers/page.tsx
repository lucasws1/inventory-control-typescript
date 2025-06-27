import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { formatTableData } from "@/utils/formatTableData";
import { endOfMonth, startOfMonth } from "date-fns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes",
};

const Customers = async () => {
  const now = new Date();
  const firstDay = startOfMonth(now);
  const lastDay = endOfMonth(now);

  const customers = await prisma.customer.findMany({
    include: {
      Invoice: {
        where: {
          OR: [
            { pending: true },
            { purchaseDate: { gte: firstDay, lte: lastDay } },
          ],
        },
        select: {
          amount: true,
          pending: true,
          purchaseDate: true,
          customerId: true,
        },
      },
    },
  });

  const tableData = formatTableData(customers, "customer");

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Customers;
