import { Prisma } from "@prisma/client";

export type CustomerWithRelations = Prisma.CustomerGetPayload<{
  include: {
    Invoice: true;
  };
}>;
