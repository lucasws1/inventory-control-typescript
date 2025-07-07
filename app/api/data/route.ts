import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to serialize dates in nested objects
function serializeDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeDates);
  }

  if (typeof obj === "object") {
    const serialized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        serialized[key] = serializeDates(obj[key]);
      }
    }
    return serialized;
  }

  return obj;
}

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

    // Serialize all date objects to ensure proper JSON serialization
    const serializedData = {
      products: serializeDates(products),
      customers: serializeDates(customers),
      invoices: serializeDates(invoices),
      stockMovements: serializeDates(stockMovements),
      invoiceItems: serializeDates(invoiceItems),
    };

    return NextResponse.json(serializedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 },
    );
  }
}
