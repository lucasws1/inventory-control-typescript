import prisma from "@/lib/prisma";
import { Metadata } from "next";
import DataTableClient from "../_dataTable/page";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Clientes",
};

const Customers = async () => {
  const customers = await prisma.customer.findMany({
    include: {
      Invoice: {
        select: {
          amount: true,
          pending: true,
          purchaseDate: true,
          customerId: true,
        },
      },
    },
  });

  return (
    <>
      <DataTableClient columns={columns} data={customers} />
    </>
  );
};

export default Customers;
