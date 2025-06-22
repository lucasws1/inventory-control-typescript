import { InvoiceItem } from "./invoiceItem";
import { StockMovement } from "./stockMovement";

export type Product = {
  id: number;
  name: string;
  price: number;
  InvoiceItem: InvoiceItem[];
  StockMovement: StockMovement[];
};
