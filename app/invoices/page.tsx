import { Metadata } from "next";
import InvoicesWithModal from "./InvoicesWithModal";

const metadata: Metadata = {
  title: "Vendas",
};

//export const revalidate = 0;

const Invoices = () => {
  return <InvoicesWithModal />;
};

export default Invoices;
