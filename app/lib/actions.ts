"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCustomer(formData: FormData) {
  const data = {};
}

export const deleteInvoice = async (invoiceId: number) => {
  try {
    const deleteInvoice = await prisma.invoice.delete({
      where: { id: invoiceId },
    });
    revalidatePath("/invoices");
    return {
      success: true,
      deleteInvoice,
    };
  } catch (error) {
    console.log("erro ao deletar");
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar a venda.",
    };
  }
};

export const handleInvoiceSubmit = async (newInvoice: any) => {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        amount: newInvoice.amount,
        pending: newInvoice.pending,
        purchaseDate: newInvoice.purchaseDate,
        customerId: newInvoice.customerId,
        InvoiceItem: {
          create: newInvoice.newInvoiceItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { InvoiceItem: true },
    });
    let newStockMovement = null;
    if (newInvoice.stockMovement && newInvoice.stockMovement.length > 0) {
      newStockMovement = await prisma.stockMovement.createMany({
        data: newInvoice.stockMovement.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          date: item.date,
          reason: item.reason,
        })),
      });
    }
    return {
      success: true,
      message: "Venda lançada com sucesso!",
      invoice,
      newStockMovement,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Erro ao lançar a venda.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : String(error),
    };
  }
};
