import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "90d";

    let daysToSubtract;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else {
      daysToSubtract = 90;
    }

    const endDate = new Date();
    const currentPeriodStart = new Date();
    currentPeriodStart.setDate(currentPeriodStart.getDate() - daysToSubtract);

    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysToSubtract);

    // Buscar dados do período atual
    const currentPeriodRevenue = await prisma.invoice.groupBy({
      by: ["purchaseDate"],
      where: {
        purchaseDate: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        purchaseDate: "asc",
      },
    });

    // Buscar dados do período anterior
    const previousPeriodRevenue = await prisma.invoice.groupBy({
      by: ["purchaseDate"],
      where: {
        purchaseDate: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        purchaseDate: "asc",
      },
    });

    // Transformar os dados para o formato esperado pelo gráfico
    const chartData = currentPeriodRevenue.map((item) => ({
      date: item.purchaseDate.toISOString().split("T")[0],
      revenue: item._sum.amount || 0,
    }));

    // Calcular totais para comparação
    const currentTotal = currentPeriodRevenue.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0,
    );
    const previousTotal = previousPeriodRevenue.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0,
    );

    // Novos Clientes
    const novosClientes = await prisma.customer.count({
      where: {
        createdAt: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
    });
    const previousNovosClientes = await prisma.customer.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
    });
    const clientesChange =
      previousNovosClientes > 0
        ? ((novosClientes - previousNovosClientes) / previousNovosClientes) *
          100
        : 0;

    // Novos Produtos
    const novosProdutos = await prisma.product.count({
      where: {
        createdAt: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
    });
    const previousNovosProdutos = await prisma.product.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
    });
    const produtosChange =
      previousNovosProdutos > 0
        ? ((novosProdutos - previousNovosProdutos) / previousNovosProdutos) *
          100
        : 0;

    // Total em estoque (soma de todos os produtos)
    const produtos = await prisma.product.findMany({
      include: {
        StockMovement: true,
      },
    });
    const totalEstoque = produtos.reduce((sum, produto) => {
      const saldo = produto.StockMovement.reduce(
        (acc, mov) => acc + mov.quantity,
        0,
      );
      return sum + saldo;
    }, 0);

    // Movimentação de estoque no período atual
    const currentPeriodStockMovements = await prisma.stockMovement.aggregate({
      where: {
        date: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    // Movimentação de estoque no período anterior
    const previousPeriodStockMovements = await prisma.stockMovement.aggregate({
      where: {
        date: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const currentStockMovement = currentPeriodStockMovements._sum.quantity || 0;
    const previousStockMovement =
      previousPeriodStockMovements._sum.quantity || 0;
    const estoqueChange =
      previousStockMovement !== 0
        ? ((currentStockMovement - previousStockMovement) /
            Math.abs(previousStockMovement)) *
          100
        : 0;

    return NextResponse.json({
      chartData,
      currentTotal,
      previousTotal,
      revenueChange:
        previousTotal > 0
          ? ((currentTotal - previousTotal) / previousTotal) * 100
          : 0,
      novosClientes,
      previousNovosClientes,
      clientesChange,
      novosProdutos,
      previousNovosProdutos,
      produtosChange,
      totalEstoque,
      estoqueChange,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
