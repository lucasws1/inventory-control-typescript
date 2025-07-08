import { Prisma } from "@/app/generated/prisma";

export type CustomerWithRelations = Prisma.CustomerGetPayload<{
  include: {
    Invoice: true;
  };
}>;
