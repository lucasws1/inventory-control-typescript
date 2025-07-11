import { Metadata } from "next";
import StockMovementClient from "./StockMovementClient";

export const metadata: Metadata = {
  title: "Estoque",
};

export const revalidate = 0;

const StockMovement = () => {
  return (
    <>
      <StockMovementClient />
    </>
  );
};

export default StockMovement;
