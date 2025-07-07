import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [products, customers, invoices, stockMovements, invoiceItems] =
      await Promise.all([
        prisma.product.findMany({
          include: {
            StockMovement: true,
            InvoiceItem: true,
          },
        }),
        prisma.customer.findMany({
          include: {
            Invoice: true,
          },
        }),
        prisma.invoice.findMany({
          include: {
            InvoiceItem: {
              include: {
                Product: true,
              },
            },
            customer: true,
          },
        }),
        prisma.stockMovement.findMany({
          include: {
            Product: true,
          },
        }),
        prisma.invoiceItem.findMany({
          include: {
            Product: true,
          },
        }),
      ]);

    return NextResponse.json({
      products,
      customers,
      invoices,
      stockMovements,
      invoiceItems,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 },
    );
  }
}
