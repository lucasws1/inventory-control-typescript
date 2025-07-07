"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useChartData } from "@/contexts/ChartDataContext";

export const description = "An interactive area chart";

const chartConfig = {
  revenue: {
    label: "Faturamento",
    color: "var(--primary)",
  },
  customers: {
    label: "Clientes",
    color: "var(--primary)",
  },
  products: {
    label: "Produtos",
    color: "var(--primary)",
  },
  stockBalance: {
    label: "Estoque",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const indicators = [
  { value: "revenue", label: "Faturamento" },
  { value: "customers", label: "Clientes" },
  { value: "products", label: "Produtos" },
  { value: "stockBalance", label: "Estoque" },
] as const;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { chartData, loading, timeRange, setTimeRange } = useChartData();
  const [selectedIndicator, setSelectedIndicator] =
    React.useState<keyof typeof chartConfig>("revenue");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile, setTimeRange]);

  const filteredData = chartData;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Indicadores</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Indicadores dos últimos{" "}
            {timeRange === "90d"
              ? "3 meses"
              : timeRange === "30d"
                ? "30 dias"
                : "7 dias"}
          </span>
          <span className="@[540px]/card:hidden">
            Últimos{" "}
            {timeRange === "90d"
              ? "3 meses"
              : timeRange === "30d"
                ? "30 dias"
                : "7 dias"}
          </span>
        </CardDescription>
        <CardAction className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={selectedIndicator}
            onValueChange={(value) =>
              setSelectedIndicator(value as keyof typeof chartConfig)
            }
          >
            <SelectTrigger className="w-full sm:w-40" size="sm">
              <SelectValue placeholder="Selecionar indicador" />
            </SelectTrigger>
            <SelectContent>
              {indicators.map((indicator) => (
                <SelectItem key={indicator.value} value={indicator.value}>
                  {indicator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 dias</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 dias</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 dias
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 dias
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center">
            <div className="text-muted-foreground">Carregando dados...</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-customers)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-customers)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-products)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-products)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillStockBalance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-stockBalance)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stockBalance)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey={selectedIndicator}
                type="monotone"
                fill={`url(#fill${selectedIndicator.charAt(0).toUpperCase() + selectedIndicator.slice(1)})`}
                stroke={`var(--color-${selectedIndicator})`}
                strokeWidth={2}
                stackId="1"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
