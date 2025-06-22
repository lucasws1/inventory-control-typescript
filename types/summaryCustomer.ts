export type SummaryCustomer = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
  pendingAmount: number;
  monthAmount: number;
  monthlyInvoiceCount: number;
};
