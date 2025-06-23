import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { CustomerTableData } from "@/types/customerTableData";
import { TableData } from "@/types/tableData";
import { endOfMonth, startOfMonth } from "date-fns";
import { Metadata } from "next";
import { formatTableData } from "@/utils/formatTableData";

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

  // const summaryCustomer: CustomerTableData[] = customers.map((customer) => {
  //   const pending = customer.Invoice.filter((inv) => inv.pending).reduce(
  //     (sum, inv) => sum + inv.amount,
  //     0,
  //   );
  //   const month = customer.Invoice.filter(
  //     (inv) => inv.purchaseDate >= firstDay && inv.purchaseDate <= lastDay,
  //   );
  //   const monthAmount = month.reduce((s, m) => s + m.amount, 0);
  //   const monthlyInvoiceCount = month.length;
  //   return {
  //     ...customer,
  //     pending,
  //     monthAmount,
  //     monthlyInvoiceCount,
  //   };
  // });

  const tableData = formatTableData(customers, "customer");

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Customers;
