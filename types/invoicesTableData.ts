import { Prisma } from "@/app/generated/prisma";

export type InvoicesTableData = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    InvoiceItem: {
      include: {
        Product: true;
      };
    };
  };
}>;
