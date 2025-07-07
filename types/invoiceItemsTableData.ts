import { Prisma } from "@/app/generated/prisma";

export type InvoiceItemTableData = Prisma.InvoiceItemGetPayload<{
  include: {
    Product: true;
    Invoice: true;
  };
}>;
