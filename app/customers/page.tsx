import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { Invoice } from "@/types/invoice";
import { SummaryCustomer } from "@/types/summaryCustomer";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { startOfMonth, endOfMonth } from "date-fns";

export default async function Customers() {
  const customers = await prisma.customer.findMany();

  const now = new Date();
  const firstDay = startOfMonth(now);
  const lastDay = endOfMonth(now);

  const invoices = await prisma.invoice.findMany({
    where: {
      customerId: { in: customers.map((customer) => customer.id) },
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
  });

  const summaryCustomer: SummaryCustomer[] = customers.map((customer) => {
    const filteredInvoices = invoices.filter(
      (inv) => inv.customerId === customer.id,
    );
    const pendingAmount = filteredInvoices
      .filter((inv) => inv.pending === true)
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const monthlyInvoices = filteredInvoices.filter(
      (inv) => inv.purchaseDate >= firstDay && inv.purchaseDate <= lastDay,
    );
    const monthAmount = monthlyInvoices.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0,
    );

    return {
      ...customer,
      pendingAmount,
      monthAmount,
      monthlyInvoiceCount: monthlyInvoices.length,
    };
  });
  console.log(summaryCustomer);

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
      <AllInOneTable customers={summaryCustomer} />
    </div>
  );
}
