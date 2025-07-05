import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany();

    return NextResponse.json(invoices);
  } catch (error) {
    console.log("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
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
        const deleted = await prisma.invoice.deleteMany({
          where: { id: { in: body.ids.map(Number) } },
        });
        return NextResponse.json({ deletedCount: deleted.count });
      } else if (body.ids.length > 0) {
        // Deleta um
        const deletedInvoice = await prisma.invoice.delete({
          where: { id: Number(body.ids) },
        });
        return NextResponse.json(deletedInvoice);
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
