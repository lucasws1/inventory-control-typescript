import { Prisma } from "@prisma/client";

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
