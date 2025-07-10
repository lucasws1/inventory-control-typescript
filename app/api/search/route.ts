import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schema para validação dos parâmetros de query
const SearchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "Query não pode estar vazia")
    .max(100, "Query muito longa"),
});

// Schema para validação da resposta
const SearchResultSchema = z.object({
  type: z.enum(["customer", "product", "invoice", "stockMovement"]),
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  url: z.string(),
  icon: z.string(),
});

const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validar parâmetros de query
    const queryValidation = SearchQuerySchema.safeParse({
      q: searchParams.get("q") || "",
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Parâmetro de pesquisa inválido" },
        { status: 400 },
      );
    }

    const { q: query } = queryValidation.data;

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
        type: "customer" as const,
        id: customer.id,
        title: customer.name,
        subtitle: customer.email || "Sem email",
        url: `/customers`,
        icon: "user",
      })),
      ...products.map((product) => ({
        type: "product" as const,
        id: product.id,
        title: product.name,
        subtitle: `R$ ${product.price.toFixed(2)}`,
        url: `/products`,
        icon: "box",
      })),
      ...invoices.map((invoice) => ({
        type: "invoice" as const,
        id: invoice.id,
        title: `Fatura #${invoice.id}`,
        subtitle: `${invoice.customer.name} - R$ ${invoice.amount.toFixed(2)}`,
        url: `/invoices`,
        icon: "dollar",
      })),
      ...stockMovements.map((movement) => ({
        type: "stockMovement" as const,
        id: movement.id,
        title: `${movement.Product.name} - ${movement.quantity > 0 ? "+" : ""}${movement.quantity}`,
        subtitle: `${movement.reason} - ${new Date(movement.date).toLocaleDateString("pt-BR")}`,
        url: `/stock-movement`,
        icon: "box",
      })),
    ];

    // Validar estrutura da resposta
    const responseValidation = SearchResponseSchema.safeParse({ results });
    if (!responseValidation.success) {
      console.error("Erro na validação da resposta:", responseValidation.error);
      return NextResponse.json(
        { error: "Erro na estrutura dos dados" },
        { status: 500 },
      );
    }

    return NextResponse.json(responseValidation.data);
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
