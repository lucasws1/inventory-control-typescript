import { Prisma } from "@/app/generated/prisma";

export type StockMovementTableData = Prisma.StockMovementGetPayload<{
  include: {
    Product: true;
  };
}>;
