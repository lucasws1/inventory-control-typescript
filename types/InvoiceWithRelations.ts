import { Prisma } from "@/app/generated/prisma";

export type InvoiceWithRelations = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    InvoiceItem: {
      include: {
        Product: true;
      };
    };
  };
}>;
