import { Invoice } from "./invoice";
import { Product } from "./product";

export type InvoiceItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  productId: number;
  Product: Product;
  invoiceId: number;
  Invoice: Invoice;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
