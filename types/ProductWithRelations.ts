import { Prisma } from "@/app/generated/prisma";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    StockMovement: true;
    InvoiceItem: true;
  };
}>;
