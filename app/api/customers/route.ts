import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
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
        const deleted = await prisma.customer.deleteMany({
          where: { id: { in: body.ids.map(Number) } },
        });
        return NextResponse.json({ deletedCount: deleted.count });
      } else if (body.ids.length > 0) {
        // Deleta um
        const deletedCustomer = await prisma.customer.delete({
          where: { id: Number(body.ids) },
        });
        return NextResponse.json(deletedCustomer);
      }
    } else {
      return NextResponse.json(
        { error: "ID or IDs are required to delete customer(s)" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error deleting customer(s):", error);
    return NextResponse.json(
      { error: "Failed to delete customer(s)" },
      { status: 500 },
    );
  }
}
