import { Prisma } from "@prisma/client";

export type StockMovementWithRelations = Prisma.StockMovementGetPayload<{
  include: {
    Product: true;
  };
}>;
