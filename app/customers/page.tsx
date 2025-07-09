import { Metadata } from "next";
import CustomersWithModal from "./CustomersWithModal";

export const metadata: Metadata = {
  title: "Clientes",
};

export const revalidate = 0;

const Customers = () => {
  return (
    <>
      <CustomersWithModal />
    </>
  );
};

export default Customers;
