import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";

// Schema para validação da resposta
const DataResponseSchema = z.object({
  products: z.array(z.any()),
  customers: z.array(z.any()),
  invoices: z.array(z.any()),
  stockMovements: z.array(z.any()),
  invoiceItems: z.array(z.any()),
});

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
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const [products, customers, invoices, stockMovements, invoiceItems] =
      await Promise.all([
        prisma.product.findMany({
          where: { userId },
          include: {
            StockMovement: true,
            InvoiceItem: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.customer.findMany({
          where: { userId },
          include: {
            Invoice: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.invoice.findMany({
          where: { userId },
          include: {
            InvoiceItem: {
              include: {
                Product: true,
              },
            },
            customer: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.stockMovement.findMany({
          where: { userId },
          include: {
            Product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.invoiceItem.findMany({
          where: { userId },
          include: {
            Product: true,
            Invoice: true,
          },
          orderBy: {
            createdAt: "desc",
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

    // Validar estrutura da resposta
    const validation = DataResponseSchema.safeParse(serializedData);
    if (!validation.success) {
      console.error("Erro na validação da resposta:", validation.error);
      return NextResponse.json(
        { error: "Erro na estrutura dos dados" },
        { status: 500 },
      );
    }

    return NextResponse.json(validation.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 },
    );
  }
}
