import { InvoicesTableData } from "@/types/invoicesTableData";
import { ProductsTableData } from "@/types/productsTableData";
import { CustomerTableData } from "@/types/customerTableData";
import { TableData } from "@/types/tableData";
import { StockMovementTableData } from "@/types/stockMovementTableData";

export type TableDataType =
  | CustomerTableData
  | InvoicesTableData
  | ProductsTableData
  | StockMovementTableData;

export function formatTableData<T extends TableDataType>(
  items: T[],
  type: "customer" | "product" | "invoice" | "stockMovement",
): TableData[] {
  if (items.length === 0) return [];

  if (type === "customer") {
    // CUSTOMER
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return (items as any[]).map((c) => {
      const pending = c.Invoice
        ? c.Invoice.filter((inv: any) => inv.pending).reduce(
            (sum: number, inv: any) => sum + inv.amount,
            0,
          )
        : 0;
      const month = c.Invoice
        ? c.Invoice.filter(
            (inv: any) =>
              inv.purchaseDate >= firstDay && inv.purchaseDate <= lastDay,
          )
        : [];
      const monthAmount = month.reduce((s: number, m: any) => s + m.amount, 0);
      const monthlyInvoiceCount = month.length;
      return {
        id: c.id,
        col1: c.name,
        col2: monthlyInvoiceCount,
        col3: pending,
        col4: monthAmount,
      };
    });
  } else if (type === "product") {
    // PRODUCT
    return (items as any[]).map((prod) => {
      const quantityInStock = prod.StockMovement
        ? prod.StockMovement.reduce((acc: number, sm: any) => {
            if (sm.reason === "COMPRA") {
              return acc + sm.quantity;
            } else if (sm.reason === "VENDA") {
              return acc - sm.quantity;
            }
            return acc;
          }, 0)
        : 0;
      return {
        id: prod.id,
        col1: prod.name,
        col2: prod.price,
        col3: quantityInStock,
        col4: quantityInStock * prod.price,
      };
    });
  } else if (type === "invoice") {
    // INVOICE
    return (items as any[]).map((invoice) => ({
      id: invoice.id,
      col1: invoice.purchaseDate.toLocaleDateString("pt-BR"),
      col2: invoice.customer.name,
      col3: invoice.InvoiceItem.map(
        (item: any) => `${item.Product.name} x ${item.quantity}`,
      ).join(", "),
      col4: invoice.amount,
    }));
  } else if (type === "stockMovement") {
    return (items as any[]).map((sm) => ({
      id: sm.id,
      col1: sm.date.toLocaleDateString("pt-BR"),
      col2: sm.Product.name,
      col3: sm.reason,
      col4: sm.quantity,
    }));
  } else {
    return [];
  }
}
