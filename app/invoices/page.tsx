import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faturas",
};

const Invoices = async () => {
  const invoices = await prisma.invoice.findMany();

  const tableData = {};
  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
    </div>
  );
};

export default Invoices;
