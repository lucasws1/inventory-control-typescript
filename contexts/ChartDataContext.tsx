"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface ChartData {
  date: string;
  revenue: number;
}

interface ChartDataContextType {
  chartData: ChartData[];
  loading: boolean;
  timeRange: string;
  setTimeRange: (range: string) => void;
  totalRevenue: number;
  revenueChange: number;
  novosClientes: number;
  clientesChange: number;
  novosProdutos: number;
  produtosChange: number;
  totalEstoque: number;
  estoqueChange: number;
  getChartData: () => Promise<void>;
}

const ChartDataContext = createContext<ChartDataContextType | undefined>(
  undefined,
);

export function ChartDataProvider({ children }: { children: React.ReactNode }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("90d");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0);
  const [novosClientes, setNovosClientes] = useState(0);
  const [clientesChange, setClientesChange] = useState(0);
  const [novosProdutos, setNovosProdutos] = useState(0);
  const [produtosChange, setProdutosChange] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [estoqueChange, setEstoqueChange] = useState(0);

  const getChartData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/chart-data?timeRange=${timeRange}`,
      );

      if (!data.chartData) {
        throw new Error("Erro ao carregar dados");
      }

      setChartData(data.chartData);
      setTotalRevenue(data.currentTotal || 0);
      setRevenueChange(data.revenueChange || 0);
      setNovosClientes(data.novosClientes || 0);
      setClientesChange(data.clientesChange || 0);
      setNovosProdutos(data.novosProdutos || 0);
      setProdutosChange(data.produtosChange || 0);
      setTotalEstoque(data.totalEstoque || 0);
      setEstoqueChange(data.estoqueChange || 0);
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico:", error);
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Mensagem:", error.response?.data);
      }
      setChartData([]);
      setTotalRevenue(0);
      setRevenueChange(0);
      setNovosClientes(0);
      setClientesChange(0);
      setNovosProdutos(0);
      setProdutosChange(0);
      setTotalEstoque(0);
      setEstoqueChange(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getChartData();
    }
  }, [timeRange]);

  const value = {
    chartData,
    loading,
    timeRange,
    setTimeRange,
    totalRevenue,
    revenueChange,
    novosClientes,
    clientesChange,
    novosProdutos,
    produtosChange,
    totalEstoque,
    estoqueChange,
    getChartData,
  };

  return (
    <ChartDataContext.Provider value={value}>
      {children}
    </ChartDataContext.Provider>
  );
}

export function useChartData() {
  const context = useContext(ChartDataContext);
  if (context === undefined) {
    throw new Error("useChartData must be used within a ChartDataProvider");
  }
  return context;
}
