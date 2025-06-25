import prisma from "@/lib/prisma";
import { Customer } from "@/types/customer";
import { InvoiceItem } from "@/types/invoiceItem";
import { Product } from "@/types/product";
import { Metadata } from "next";
import InvoiceForm from "./invoiceForm";

export const metadata: Metadata = {
  title: "Lançar Venda",
};

export default async function NewInvoice() {
  const [customers, products, invoiceItems] = await Promise.all([
    prisma.customer.findMany(),
    prisma.product.findMany(),
    prisma.invoiceItem.findMany(),
  ]);

  return (
    <div>
      <InvoiceForm
        customers={customers as Customer[]}
        products={products as Product[]}
        invoiceItems={invoiceItems as InvoiceItem[]}
      />
    </div>
  );
}
