import { InvoicesTableData } from "@/types/invoicesTableData";
import { ProductsTableData } from "@/types/productsTableData";
import { CustomerTableData } from "@/types/customerTableData";
import { TableData } from "@/types/tableData";

// export function formatTableData(items: Customer[]): TableData[];
export function formatTableData(items: CustomerTableData[]): TableData[];
export function formatTableData(items: InvoicesTableData[]): TableData[];
export function formatTableData(items: ProductsTableData[]): TableData[];

export function formatTableData(items: any[]): TableData[] {
  if (items.length === 0) return [];

  if ("monthlyInvoiceCount" in items[0]) {
    // SummaryCustomer[]
    return items.map((c: CustomerTableData) => ({
      id: c.id,
      col1: c.name,
      col2: c.monthlyInvoiceCount,
      col3: c.pendingAmount,
      col4: c.monthAmount,
    }));
  } else {
    // Any (recebe invoices do dashboard)
    return items.map((invoice: InvoicesTableData) => ({
      id: invoice.id,
      col1: invoice.purchaseDate.toLocaleDateString("pt-BR"),
      col2: invoice.customer.name,
      col3: invoice.InvoiceItem.map(
        (item: any) => `${item.Product.name} x ${item.quantity}`,
      ).join(", "),
      col4: invoice.amount,
    }));
  }
}
