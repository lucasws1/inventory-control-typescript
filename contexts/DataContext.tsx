"use client";

import { InvoicesTableData } from "@/types/invoicesTableData";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { StockMovementTableData } from "@/types/stockMovementTableData";
import { ProductsTableData } from "@/types/productsTableData";
import { CustomerTableData } from "@/types/customerTableData";
import { InvoiceItemTableData } from "@/types/invoiceItemsTableData";

interface DataContextType {
  products: ProductsTableData[];
  customers: CustomerTableData[];
  invoices: InvoicesTableData[];
  stockMovements: StockMovementTableData[];
  invoiceItems: InvoiceItemTableData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductsTableData[]>([]);
  const [customers, setCustomers] = useState<CustomerTableData[]>([]);
  const [invoices, setInvoices] = useState<InvoicesTableData[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemTableData[]>([]);
  const [stockMovements, setStockMovements] = useState<
    StockMovementTableData[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/data");

      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const data = await response.json();

      setProducts(data.products);
      setCustomers(data.customers);
      setInvoices(data.invoices);
      setStockMovements(data.stockMovements);
      setInvoiceItems(data.invoiceItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    products,
    customers,
    invoices,
    stockMovements,
    invoiceItems,
    loading,
    error,
    refreshData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
