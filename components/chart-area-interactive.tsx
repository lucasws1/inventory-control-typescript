"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader } from "./Loader/Loader";

export const description = "An interactive area chart";

const chartConfig = {
  stockPurchases: {
    label: "Entradas",
    color: "var(--primary)",
  },
  stockSales: {
    label: "Saídas",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { chartData, loading, timeRange, setTimeRange } = useChartData();

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
            <div className="text-muted-foreground">
              <Loader variant="dots" size="lg" />
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
            style={{ "--color-stockSales": "#6366f1" } as React.CSSProperties}
            // style={
            //   {
            //     "--color-stockPurchases": "oklch(0.81 0.17 75.35)",
            //   } as React.CSSProperties
            // }
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillStockPurchases"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-stockPurchases)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stockPurchases)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillStockSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-stockSales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-stockSales)"
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
              <YAxis domain={[0, "dataMax"]} />
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
                dataKey="stockPurchases"
                type="monotone"
                fill="url(#fillStockPurchases)"
                stroke="var(--color-stockPurchases)"
                strokeWidth={2}
              />
              <Area
                dataKey="stockSales"
                type="monotone"
                fill="url(#fillStockSales)"
                stroke="var(--color-stockSales)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
