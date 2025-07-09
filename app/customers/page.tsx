import { Metadata } from "next";
import CustomersClient from "./CustomersClient";

export const metadata: Metadata = {
  title: "Clientes",
};

export const revalidate = 0;

const Customers = () => {
  return <CustomersClient />;
};

export default Customers;
