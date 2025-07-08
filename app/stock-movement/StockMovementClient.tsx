"use client";

import { StockMovementWithRelations } from "@/types/StockMovementWithRelations";
import dynamic from "next/dynamic";

const StockMovementWithModal = dynamic(
  () => import("./StockMovementWithModal"),
  {
    ssr: false,
  },
);

export default function StockMovementClient() {
  return <StockMovementWithModal />;
}
