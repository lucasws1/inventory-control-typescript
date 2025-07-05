import OverlaySpinner from "@/components/overlaySpinner";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const CustomersWithModal = dynamic(() => import("./CustomersWithModal"), {
  loading: () => (
    <div>
      <OverlaySpinner />
    </div>
  ),
});

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
      <CustomersWithModal customers={customers as any[]} />
    </>
  );
};

export default Customers;
