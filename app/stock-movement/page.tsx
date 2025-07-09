import { Metadata } from "next";
import StockMovementWithModal from "./StockMovementWithModal";

export const metadata: Metadata = {
  title: "Estoque",
};

export const revalidate = 0;

const StockMovement = () => {
  return (
    <>
      <StockMovementWithModal />
    </>
  );
};

export default StockMovement;
