"use client";

import {
  // IconLoader,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useChartData } from "@/contexts/ChartDataContext";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { Loader } from "./Loader/Loader";

const Spinner = () => {
  return <Loader variant="classic" size="lg" />;
};

export function SectionCards() {
  const {
    totalRevenue,
    revenueChange,
    loading,
    novosClientes,
    clientesChange,
    novosProdutos,
    produtosChange,
    totalEstoque,
    estoqueChange,
  } = useChartData();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Faturamento */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Faturamento</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <Spinner />
            ) : (
              <span className="flex items-center gap-2">
                {formatCurrencyBRL(totalRevenue)}
              </span>
            )}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {revenueChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {revenueChange >= 0 ? "+" : ""}
              {revenueChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {revenueChange >= 0 ? "Tendência de alta" : "Tendência de baixa"}{" "}
            {revenueChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Receita bruta no período selecionado
          </div>
        </CardFooter>
      </Card>
      {/* Novos Clientes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Novos Clientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Spinner /> : novosClientes}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {clientesChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {clientesChange >= 0 ? "+" : ""}
              {clientesChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {clientesChange >= 0 ? "Prospecção em alta" : "Prospecção em baixa"}{" "}
            {clientesChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Aquisição de clientes no período selecionado
          </div>
        </CardFooter>
      </Card>
      {/* Novos Produtos */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Novos Produtos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Spinner /> : novosProdutos}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {produtosChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {produtosChange >= 0 ? "+" : ""}
              {produtosChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {produtosChange >= 0
              ? "Catálogo em expansão"
              : "Oportunidade de crescimento"}{" "}
            {produtosChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Novos produtos no período selecionado
          </div>
        </CardFooter>
      </Card>
      {/* Estoque Total */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estoque Total</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Spinner /> : totalEstoque}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {estoqueChange >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {estoqueChange >= 0 ? "+" : ""}
              {estoqueChange.toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {estoqueChange >= 0
              ? "Expansão do estoque"
              : "Oportunidade de melhoria"}{" "}
            {estoqueChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Taxa de expansão no período selecionado
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
