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

    // Faturamento diário
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

    // Novos clientes diários
    const currentPeriodCustomers = await prisma.customer.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Novos produtos diários
    const currentPeriodProducts = await prisma.product.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Buscar todas as movimentações de estoque até a data final para calcular saldo acumulado
    const allStockMovements = await prisma.stockMovement.findMany({
      where: {
        date: {
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
      include: {
        Product: true,
      },
    });

    // Calcular saldo acumulado por data
    const stockBalanceByDate = new Map();
    let runningBalance = 0;

    // Processar todas as movimentações em ordem cronológica
    allStockMovements.forEach((movement) => {
      runningBalance += movement.quantity;
      const dateKey = movement.date.toISOString().split("T")[0];

      // Atualizar o saldo para esta data
      stockBalanceByDate.set(dateKey, runningBalance);
    });

    // Criar um mapa de datas para facilitar a combinação dos dados
    const dateMap = new Map();

    // Adicionar dados de faturamento
    currentPeriodRevenue.forEach((item) => {
      const date = item.purchaseDate.toISOString().split("T")[0];
      dateMap.set(date, {
        date,
        revenue: item._sum.amount || 0,
        customers: 0,
        products: 0,
        stockBalance: stockBalanceByDate.get(date) || 0,
      });
    });

    // Adicionar dados de clientes
    currentPeriodCustomers.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (dateMap.has(date)) {
        dateMap.get(date).customers = item._count.id;
      } else {
        dateMap.set(date, {
          date,
          revenue: 0,
          customers: item._count.id,
          products: 0,
          stockBalance: stockBalanceByDate.get(date) || 0,
        });
      }
    });

    // Adicionar dados de produtos
    currentPeriodProducts.forEach((item) => {
      const date = item.createdAt.toISOString().split("T")[0];
      if (dateMap.has(date)) {
        dateMap.get(date).products = item._count.id;
      } else {
        dateMap.set(date, {
          date,
          revenue: 0,
          customers: 0,
          products: item._count.id,
          stockBalance: stockBalanceByDate.get(date) || 0,
        });
      }
    });

    // Adicionar dados de saldo de estoque para todas as datas do período
    const startDate = new Date(currentPeriodStart);
    const endDateObj = new Date(endDate);

    for (
      let d = new Date(startDate);
      d <= endDateObj;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {
          date: dateKey,
          revenue: 0,
          customers: 0,
          products: 0,
          stockBalance: stockBalanceByDate.get(dateKey) || 0,
        });
      } else {
        // Atualizar o saldo de estoque para datas que já existem
        dateMap.get(dateKey).stockBalance =
          stockBalanceByDate.get(dateKey) || 0;
      }
    }

    // Converter para array e ordenar por data
    const chartData = Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calcular totais para comparação
    const currentTotal = currentPeriodRevenue.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0,
    );

    // Buscar dados do período anterior para comparação
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
    const previousTotal = previousPeriodRevenue.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0,
    );
    const revenueChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : 0;

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

    // Total em estoque atual
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

    // Calcular variação do estoque comparando início e fim do período
    const stockMovementsInPeriod = await prisma.stockMovement.findMany({
      where: {
        date: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
    });

    const stockMovementsPreviousPeriod = await prisma.stockMovement.findMany({
      where: {
        date: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
    });

    const currentPeriodStockChange = stockMovementsInPeriod.reduce(
      (sum, mov) => sum + mov.quantity,
      0,
    );
    const previousPeriodStockChange = stockMovementsPreviousPeriod.reduce(
      (sum, mov) => sum + mov.quantity,
      0,
    );

    const estoqueChange =
      previousPeriodStockChange !== 0
        ? ((currentPeriodStockChange - previousPeriodStockChange) /
            Math.abs(previousPeriodStockChange)) *
          100
        : 0;

    return NextResponse.json({
      chartData,
      currentTotal,
      previousTotal,
      revenueChange,
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
