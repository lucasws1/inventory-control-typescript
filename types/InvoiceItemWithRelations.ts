import { Prisma } from "@prisma/client";

export type InvoiceItemWithRelations = Prisma.InvoiceItemGetPayload<{
  include: {
    Product: true;
    Invoice: true;
  };
}>;
