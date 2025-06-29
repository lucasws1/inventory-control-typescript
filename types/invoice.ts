import { Customer } from "./customer";
import { InvoiceItem } from "./invoiceItem";

export type Invoice = {
  id: number;
  amount: number;
  purchaseDate: Date;
  pending: boolean;
  customerId: number;
  customer: Customer;
  InvoiceItem: InvoiceItem[];
};
