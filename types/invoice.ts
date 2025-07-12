import { Customer } from "./customer";
import { InvoiceItem } from "./invoiceItem";

export type Invoice = {
  id: number;
  amount: number;
  purchaseDate: Date;
  pending: boolean;
  customerId: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  customer: Customer;
  InvoiceItem: InvoiceItem[];
};
