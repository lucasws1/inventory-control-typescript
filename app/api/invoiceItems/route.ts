import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoiceItems = await prisma.invoiceItem.findMany();

    return NextResponse.json(invoiceItems);
  } catch (error) {
    console.error("Error fetching invoice items:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice items" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (body.ids) {
      if (Array.isArray(body.ids) && body.ids.length > 1) {
        // Deleta vários
        const deleted = await prisma.invoiceItem.deleteMany({
          where: { id: { in: body.ids.map(Number) } },
        });
        return NextResponse.json({ deletedCount: deleted.count });
      } else if (body.ids.length > 0) {
        // Deleta um
        const deletedInvoiceItem = await prisma.invoiceItem.delete({
          where: { id: Number(body.ids) },
        });
        return NextResponse.json(deletedInvoiceItem);
      }
    } else {
      return NextResponse.json(
        { error: "ID or IDs are required to delete invoice(s)" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error deleting invoice(s):", error);
    return NextResponse.json(
      { error: "Failed to delete invoice(s)" },
      { status: 500 },
    );
  }
}
