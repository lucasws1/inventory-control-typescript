import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const currentUserId = session.user.id;

    // Contar dados do usuário atual
    const [
      currentUserProducts,
      currentUserCustomers,
      currentUserInvoices,
      currentUserStockMovements,
      currentUserInvoiceItems,
    ] = await Promise.all([
      prisma.product.count({ where: { userId: currentUserId } }),
      prisma.customer.count({ where: { userId: currentUserId } }),
      prisma.invoice.count({ where: { userId: currentUserId } }),
      prisma.stockMovement.count({ where: { userId: currentUserId } }),
      prisma.invoiceItem.count({ where: { userId: currentUserId } }),
    ]);

    // Contar dados do usuário padrão
    const [
      defaultUserProducts,
      defaultUserCustomers,
      defaultUserInvoices,
      defaultUserStockMovements,
      defaultUserInvoiceItems,
    ] = await Promise.all([
      prisma.product.count({ where: { userId: "default-user-id" } }),
      prisma.customer.count({ where: { userId: "default-user-id" } }),
      prisma.invoice.count({ where: { userId: "default-user-id" } }),
      prisma.stockMovement.count({ where: { userId: "default-user-id" } }),
      prisma.invoiceItem.count({ where: { userId: "default-user-id" } }),
    ]);

    // Verificar se o usuário padrão existe
    const defaultUser = await prisma.user.findUnique({
      where: { id: "default-user-id" },
    });

    return NextResponse.json({
      currentUser: {
        id: currentUserId,
        name: session.user.name,
        email: session.user.email,
      },
      currentUserData: {
        products: currentUserProducts,
        customers: currentUserCustomers,
        invoices: currentUserInvoices,
        stockMovements: currentUserStockMovements,
        invoiceItems: currentUserInvoiceItems,
        total:
          currentUserProducts +
          currentUserCustomers +
          currentUserInvoices +
          currentUserStockMovements +
          currentUserInvoiceItems,
      },
      defaultUserData: {
        exists: !!defaultUser,
        products: defaultUserProducts,
        customers: defaultUserCustomers,
        invoices: defaultUserInvoices,
        stockMovements: defaultUserStockMovements,
        invoiceItems: defaultUserInvoiceItems,
        total:
          defaultUserProducts +
          defaultUserCustomers +
          defaultUserInvoices +
          defaultUserStockMovements +
          defaultUserInvoiceItems,
      },
      solution:
        currentUserProducts +
          currentUserCustomers +
          currentUserInvoices +
          currentUserStockMovements +
          currentUserInvoiceItems ===
          0 &&
        defaultUserProducts +
          defaultUserCustomers +
          defaultUserInvoices +
          defaultUserStockMovements +
          defaultUserInvoiceItems >
          0
          ? "MIGRATE_DATA_TO_CURRENT_USER"
          : "NO_ACTION_NEEDED",
    });
  } catch (error) {
    console.error("Erro no debug:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
