import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = query.trim();

    // Buscar clientes
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 5,
    });

    // Buscar produtos
    const products = await prisma.product.findMany({
      where: {
        name: { contains: searchTerm, mode: "insensitive" },
      },
      take: 5,
    });

    // Buscar faturas
    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { id: { equals: parseInt(searchTerm) || 0 } },
          {
            customer: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        customer: true,
      },
      take: 5,
    });

    // Buscar movimentações de estoque
    const stockMovements = await prisma.stockMovement.findMany({
      where: {
        OR: [
          { id: { equals: parseInt(searchTerm) || 0 } },
          {
            Product: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
        ],
      },
      include: {
        Product: true,
      },
      take: 5,
    });

    const results = [
      ...customers.map((customer) => ({
        type: "customer",
        id: customer.id,
        title: customer.name,
        subtitle: customer.email || "Sem email",
        url: `/customers/${customer.id}`,
        icon: "user",
      })),
      ...products.map((product) => ({
        type: "product",
        id: product.id,
        title: product.name,
        subtitle: `R$ ${product.price.toFixed(2)}`,
        url: `/products/${product.id}`,
        icon: "box",
      })),
      ...invoices.map((invoice) => ({
        type: "invoice",
        id: invoice.id,
        title: `Fatura #${invoice.id}`,
        subtitle: `${invoice.customer.name} - R$ ${invoice.amount.toFixed(2)}`,
        url: `/invoices/${invoice.id}`,
        icon: "dollar",
      })),
      ...stockMovements.map((movement) => ({
        type: "stockMovement",
        id: movement.id,
        title: `${movement.Product.name} - ${movement.quantity > 0 ? "+" : ""}${movement.quantity}`,
        subtitle: `${movement.reason} - ${new Date(movement.date).toLocaleDateString("pt-BR")}`,
        url: `/stock-movement/${movement.id}`,
        icon: "box",
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
