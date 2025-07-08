import { Prisma } from "@/app/generated/prisma";

export type StockMovementWithRelations = Prisma.StockMovementGetPayload<{
  include: {
    Product: true;
  };
}>;
