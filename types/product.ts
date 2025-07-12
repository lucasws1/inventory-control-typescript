import { InvoiceItem } from "./invoiceItem";
import { StockMovement } from "./stockMovement";

export type Product = {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  InvoiceItem: InvoiceItem[];
  StockMovement: StockMovement[];
};
