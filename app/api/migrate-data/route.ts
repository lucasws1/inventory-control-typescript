import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const currentUserId = session.user.id;

    // Verificar se o usuário já tem dados
    const existingData = await Promise.all([
      prisma.product.count({ where: { userId: currentUserId } }),
      prisma.customer.count({ where: { userId: currentUserId } }),
      prisma.invoice.count({ where: { userId: currentUserId } }),
      prisma.stockMovement.count({ where: { userId: currentUserId } }),
      prisma.invoiceItem.count({ where: { userId: currentUserId } }),
    ]);

    const totalExisting = existingData.reduce((sum, count) => sum + count, 0);

    if (totalExisting > 0) {
      return NextResponse.json(
        {
          error: "Usuário já possui dados. Migração não é necessária.",
          existingData: {
            products: existingData[0],
            customers: existingData[1],
            invoices: existingData[2],
            stockMovements: existingData[3],
            invoiceItems: existingData[4],
            total: totalExisting,
          },
        },
        { status: 400 },
      );
    }

    // Verificar se existem dados do usuário padrão para migrar
    const defaultData = await Promise.all([
      prisma.product.count({ where: { userId: "default-user-id" } }),
      prisma.customer.count({ where: { userId: "default-user-id" } }),
      prisma.invoice.count({ where: { userId: "default-user-id" } }),
      prisma.stockMovement.count({ where: { userId: "default-user-id" } }),
      prisma.invoiceItem.count({ where: { userId: "default-user-id" } }),
    ]);

    const totalDefault = defaultData.reduce((sum, count) => sum + count, 0);

    if (totalDefault === 0) {
      return NextResponse.json({
        message: "Não há dados do usuário padrão para migrar.",
        defaultData: {
          products: defaultData[0],
          customers: defaultData[1],
          invoices: defaultData[2],
          stockMovements: defaultData[3],
          invoiceItems: defaultData[4],
          total: totalDefault,
        },
      });
    }

    // Realizar a migração dentro de uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Migrar dados em ordem (respeitar dependências)

      // 1. Migrar Customers
      const migratedCustomers = await tx.customer.updateMany({
        where: { userId: "default-user-id" },
        data: { userId: currentUserId },
      });

      // 2. Migrar Products
      const migratedProducts = await tx.product.updateMany({
        where: { userId: "default-user-id" },
        data: { userId: currentUserId },
      });

      // 3. Migrar Invoices
      const migratedInvoices = await tx.invoice.updateMany({
        where: { userId: "default-user-id" },
        data: { userId: currentUserId },
      });

      // 4. Migrar StockMovements
      const migratedStockMovements = await tx.stockMovement.updateMany({
        where: { userId: "default-user-id" },
        data: { userId: currentUserId },
      });

      // 5. Migrar InvoiceItems
      const migratedInvoiceItems = await tx.invoiceItem.updateMany({
        where: { userId: "default-user-id" },
        data: { userId: currentUserId },
      });

      return {
        customers: migratedCustomers.count,
        products: migratedProducts.count,
        invoices: migratedInvoices.count,
        stockMovements: migratedStockMovements.count,
        invoiceItems: migratedInvoiceItems.count,
      };
    });

    const totalMigrated = Object.values(result).reduce(
      (sum, count) => sum + count,
      0,
    );

    return NextResponse.json({
      success: true,
      message: `Migração concluída! ${totalMigrated} registros migrados para o usuário atual.`,
      migratedData: result,
      user: {
        id: currentUserId,
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error("Erro na migração:", error);
    return NextResponse.json(
      {
        error: "Erro interno durante a migração",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
