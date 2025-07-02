import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const invoiceId = parseInt(params.id);

    if (isNaN(invoiceId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: invoice.id.toString(),
      customer: {
        name: invoice.customer.name,
      },
      purchaseDate: invoice.purchaseDate.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar invoice:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
