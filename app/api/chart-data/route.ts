import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Schema para validação dos parâmetros de query
const ChartDataQuerySchema = z.object({
  timeRange: z.enum(["7d", "30d", "90d"]).default("90d"),
});

/**
 * Calcula o estoque considerando os tipos de movimentação:
 * - COMPRA e AJUSTE_POSITIVO: soma
 * - VENDA e AJUSTE_NEGATIVO: subtrai
 * - OUTRO: soma (comportamento padrão)
 */
function calculateStockBalance(
  stockMovements: Array<{ quantity: number; reason: string }>,
) {
  return stockMovements.reduce((balance, movement) => {
    switch (movement.reason) {
      case "COMPRA":
      case "AJUSTE_POSITIVO":
      case "OUTRO":
        return balance + movement.quantity;
      case "VENDA":
      case "AJUSTE_NEGATIVO":
        return balance - movement.quantity;
      default:
        return balance + movement.quantity; // fallback
    }
  }, 0);
}

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const calculateStockPurchases = (
  stockMovements: Array<{ quantity: number; reason: string }>,
) => {
  return stockMovements.reduce((balance, movement) => {
    if (movement.reason === "COMPRA" || movement.reason === "AJUSTE_POSITIVO") {
      return balance + movement.quantity;
    }
    return balance;
  }, 0);
};

const calculateStockSales = (
  stockMovements: Array<{ quantity: number; reason: string }>,
) => {
  return stockMovements.reduce((balance, movement) => {
    if (movement.reason === "VENDA" || movement.reason === "AJUSTE_NEGATIVO") {
      return balance - movement.quantity;
    }
    return balance;
  }, 0);
};

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Validar parâmetros de query
    const queryValidation = ChartDataQuerySchema.safeParse({
      timeRange: searchParams.get("timeRange"),
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Parâmetro timeRange inválido. Use: 7d, 30d ou 90d" },
        { status: 400 },
      );
    }

    const { timeRange } = queryValidation.data;

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
    const previousPeriodEnd = new Date(currentPeriodStart);

    // Get all data for the current period
    const [invoices, customers, products, stockMovements] = await Promise.all([
      // All invoices in the period
      prisma.invoice.findMany({
        where: {
          userId,
          purchaseDate: {
            gte: currentPeriodStart,
            lte: endDate,
          },
        },
        orderBy: {
          purchaseDate: "asc",
        },
      }),

      // All customers created in the period
      prisma.customer.findMany({
        where: {
          userId,
          createdAt: {
            gte: currentPeriodStart,
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // All products created in the period
      prisma.product.findMany({
        where: {
          userId,
          createdAt: {
            gte: currentPeriodStart,
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      // All stock movements up to end date for cumulative calculation
      prisma.stockMovement.findMany({
        where: {
          userId,
          date: {
            lte: endDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      }),
    ]);

    // Generate all dates in the period
    const dates = [];
    for (
      let d = new Date(currentPeriodStart);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d));
    }

    // Calculate cumulative data for each date
    const chartData = dates.map((date) => {
      const dateKey = date.toISOString().split("T")[0];

      // Cumulative revenue up to this date
      const revenueUpToDate = invoices
        .filter((invoice) => invoice.purchaseDate <= date)
        .reduce((sum, invoice) => sum + invoice.amount, 0);

      // Cumulative customers up to this date
      const customersUpToDate = customers.filter(
        (customer) => customer.createdAt <= date,
      ).length;

      // Cumulative products up to this date
      const productsUpToDate = products.filter(
        (product) => product.createdAt <= date,
      ).length;

      // Current stock balance up to this date
      const stockBalanceUpToDate = calculateStockBalance(
        stockMovements.filter((movement) => isSameDay(movement.date, date)),
      );

      const stockPurchasesUpToDate = calculateStockPurchases(
        stockMovements.filter((movement) => isSameDay(movement.date, date)),
      );

      const stockSalesUpToDate = calculateStockSales(
        stockMovements.filter((movement) => isSameDay(movement.date, date)),
      );

      return {
        date: dateKey,
        revenue: revenueUpToDate,
        customers: customersUpToDate,
        products: productsUpToDate,
        stockBalance: stockBalanceUpToDate,
        stockPurchases: stockPurchasesUpToDate,
        stockSales: stockSalesUpToDate,
      };
    });

    // Calculate totals for comparison with previous period
    const currentTotal = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

    // Previous period data for comparison
    const [previousInvoices, previousCustomers, previousProducts] =
      await Promise.all([
        prisma.invoice.findMany({
          where: {
            userId,
            purchaseDate: {
              gte: previousPeriodStart,
              lt: previousPeriodEnd,
            },
          },
        }),

        prisma.customer.count({
          where: {
            userId,
            createdAt: {
              gte: previousPeriodStart,
              lt: previousPeriodEnd,
            },
          },
        }),

        prisma.product.count({
          where: {
            userId,
            createdAt: {
              gte: previousPeriodStart,
              lt: previousPeriodEnd,
            },
          },
        }),
      ]);

    const previousTotal = previousInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const revenueChange =
      previousTotal > 0
        ? ((currentTotal - previousTotal) / previousTotal) * 100
        : currentTotal > 0
          ? 100
          : 0; // If no previous revenue but current exists, 100% growth

    // Calculate total customers at end of each period for comparison
    const totalCustomersAtEndOfCurrentPeriod = await prisma.customer.count({
      where: {
        userId,
        createdAt: {
          lte: endDate,
        },
      },
    });

    const totalCustomersAtEndOfPreviousPeriod = await prisma.customer.count({
      where: {
        userId,
        createdAt: {
          lte: previousPeriodEnd,
        },
      },
    });

    // Current period counts (new customers created in period)
    const novosClientes = customers.length;
    const previousNovosClientes = previousCustomers;

    const vendasRealizadas = invoices.length;
    const previousVendasRealizadas = previousInvoices.length;

    // Calculate growth based on total customer base growth
    const clientesChange =
      totalCustomersAtEndOfPreviousPeriod > 0
        ? ((totalCustomersAtEndOfCurrentPeriod -
            totalCustomersAtEndOfPreviousPeriod) /
            totalCustomersAtEndOfPreviousPeriod) *
          100
        : totalCustomersAtEndOfCurrentPeriod > 0
          ? 100
          : 0;

    // Calculate total products at end of each period for comparison
    const totalProductsAtEndOfCurrentPeriod = await prisma.product.count({
      where: {
        userId,
        createdAt: {
          lte: endDate,
        },
      },
    });

    const totalProductsAtEndOfPreviousPeriod = await prisma.product.count({
      where: {
        userId,
        createdAt: {
          lte: previousPeriodEnd,
        },
      },
    });

    const novosProdutos = products.length;
    const previousNovosProdutos = previousProducts;

    // Calculate total sales at end of each period for comparison
    const vendasRealizadasAtEndOfCurrentPeriod = await prisma.invoice.count({
      where: {
        userId,
        purchaseDate: {
          lte: endDate,
        },
      },
    });

    const vendasRealizadasAtEndOfPreviousPeriod = await prisma.invoice.count({
      where: {
        userId,
        purchaseDate: {
          lte: previousPeriodEnd,
        },
      },
    });

    // Calculate growth based on total sales growth
    const vendasChange =
      vendasRealizadasAtEndOfPreviousPeriod > 0
        ? ((vendasRealizadasAtEndOfCurrentPeriod -
            vendasRealizadasAtEndOfPreviousPeriod) /
            vendasRealizadasAtEndOfPreviousPeriod) *
          100
        : vendasRealizadasAtEndOfCurrentPeriod > 0
          ? 100
          : 0;

    // Calculate growth based on total product catalog growth
    const produtosChange =
      totalProductsAtEndOfPreviousPeriod > 0
        ? ((totalProductsAtEndOfCurrentPeriod -
            totalProductsAtEndOfPreviousPeriod) /
            totalProductsAtEndOfPreviousPeriod) *
          100
        : totalProductsAtEndOfCurrentPeriod > 0
          ? 100
          : 0;

    // Stock change for the period (not total stock)
    const currentPeriodStockMovements = await prisma.stockMovement.findMany({
      where: {
        userId,
        date: {
          gte: currentPeriodStart,
          lte: endDate,
        },
      },
      select: {
        quantity: true,
        reason: true,
      },
    });

    const previousPeriodStockMovements = await prisma.stockMovement.findMany({
      where: {
        userId,
        date: {
          gte: previousPeriodStart,
          lt: previousPeriodEnd,
        },
      },
      select: {
        quantity: true,
        reason: true,
      },
    });

    const currentPeriodStockChange = calculateStockBalance(
      currentPeriodStockMovements,
    );
    const previousPeriodStockChange = calculateStockBalance(
      previousPeriodStockMovements,
    );

    const estoqueChange =
      previousPeriodStockChange !== 0
        ? ((currentPeriodStockChange - previousPeriodStockChange) /
            Math.abs(previousPeriodStockChange)) *
          100
        : 0;

    // Calculate total current stock
    const allStockMovements = await prisma.stockMovement.findMany({
      where: {
        userId,
        date: {
          lte: endDate,
        },
      },
      select: {
        quantity: true,
        reason: true,
      },
    });

    const totalEstoque = calculateStockBalance(allStockMovements);

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
      totalEstoque: totalEstoque || 0,
      movimentacaoEstoque: currentPeriodStockChange,
      estoqueChange,
      currentPeriodStockChange,
      vendasRealizadas,
      previousVendasRealizadas,
      vendasChange,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
