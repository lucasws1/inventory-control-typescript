import { Customer } from "./customer";
import { InvoiceItem } from "./invoiceItem";

export type Invoice = {
  id: number;
  amount: number;
  purchaseDate: Date;
  customerId: number;
  Customer: Customer;
  InvoiceItem: InvoiceItem[];
};
