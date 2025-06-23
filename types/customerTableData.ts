import { Prisma } from "@/app/generated/prisma";

export type CustomerTableData = Prisma.CustomerGetPayload<{
  include: {
    Invoice: {
      select: {
        amount: true;
        pending: true;
        purchaseDate: true;
        customerId: true;
      };
    };
  };
}>;
