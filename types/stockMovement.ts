import { Product } from "./product";
import { StockReason } from "./stockReason";

export type StockMovement = {
  id: number;
  productId: number;
  Product: Product;
  quantity: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  reason: StockReason;
  userId: string;
};
