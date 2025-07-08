import { Prisma } from "@/app/generated/prisma";

export type InvoiceItemWithRelations = Prisma.InvoiceItemGetPayload<{
  include: {
    Product: true;
    Invoice: true;
  };
}>;
