"use client";

import { StockMovementTableData } from "@/types/stockMovementTableData";
import dynamic from "next/dynamic";

const StockMovementWithModal = dynamic(
  () => import("./StockMovementWithModal"),
  {
    ssr: false,
  },
);

export default function StockMovementClient({
  stockMovements,
}: {
  stockMovements: any[];
}) {
  return <StockMovementWithModal stockMovements={stockMovements} />;
}
