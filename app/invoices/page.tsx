import { Metadata } from "next";
import InvoicesWithModal from "./InvoicesWithModal";

const metadata: Metadata = {
  title: "Vendas",
};

const Invoices = () => {
  return <InvoicesWithModal />;
};

export default Invoices;
