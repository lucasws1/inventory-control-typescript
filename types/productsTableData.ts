import { Prisma } from "@/app/generated/prisma";

export type ProductsTableData = Prisma.ProductGetPayload<{
  include: {
    StockMovement: true;
  };
}>;
