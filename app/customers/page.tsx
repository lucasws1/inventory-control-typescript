import prisma from "@/lib/prisma";
import { Metadata } from "next";
import CustomersClient from "./CustomersClient";

export const metadata: Metadata = {
  title: "Clientes",
};

export const revalidate = 0;

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
      <CustomersClient />
    </>
  );
};

export default Customers;
