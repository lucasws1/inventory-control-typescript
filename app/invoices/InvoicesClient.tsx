"use client";

import { InvoicesTableData } from "@/types/invoicesTableData";
import dynamic from "next/dynamic";

const InvoicesWithModal = dynamic(() => import("./InvoicesWithModal"), {
  ssr: false,
});

export default function InvoicesClient({
  invoices,
}: {
  invoices: InvoicesTableData[];
}) {
  return <InvoicesWithModal invoices={invoices} />;
}
