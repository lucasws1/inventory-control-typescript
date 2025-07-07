import prisma from "@/lib/prisma";
import { InvoicesTableData } from "@/types/invoicesTableData";
import { createContext, useEffect, useState } from "react";

interface InvoicesDataContextType {
  invoices: InvoicesTableData[];
  setInvoices: (invoices: InvoicesTableData[]) => void;
}

const InvoicesDataContext = createContext<InvoicesDataContextType | undefined>(
  undefined,
);

export async function InvoicesDataProvider({
  children,
}: {
  children: React.ReactNode;
  invoices: InvoicesTableData[];
}) {
  const [invoices, setInvoices] = useState<InvoicesTableData[]>([]);

  const fetchInvoices = async () => {
    const invoicesData: InvoicesTableData[] = await prisma.invoice.findMany({
      orderBy: {
        purchaseDate: "desc",
      },
      include: {
        customer: true,
        InvoiceItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    setInvoices(invoicesData);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);
}
