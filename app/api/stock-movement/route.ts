import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stockMovements = await prisma.stockMovement.findMany();

    return NextResponse.json(stockMovements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock movements" },
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
        const deleted = await prisma.stockMovement.deleteMany({
          where: { id: { in: body.ids.map(Number) } },
        });
        return NextResponse.json({ deletedCount: deleted.count });
      } else if (body.ids.length > 0) {
        // Deleta um
        const deletedStockMovement = await prisma.stockMovement.delete({
          where: { id: Number(body.ids) },
        });
        return NextResponse.json(deletedStockMovement);
      }
    } else {
      return NextResponse.json(
        { error: "ID or IDs are required to delete stockMovement(s)" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error deleting stockMovement(s):", error);
    return NextResponse.json(
      { error: "Failed to delete stockMovement(s)" },
      { status: 500 },
    );
  }
}
