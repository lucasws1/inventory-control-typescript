import { Metadata } from "next";
import InvoicesClient from "./InvoicesClient";

const metadata: Metadata = {
  title: "Vendas",
};

const Invoices = () => {
  return <InvoicesClient />;
};

export default Invoices;
