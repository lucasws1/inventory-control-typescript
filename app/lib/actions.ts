"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateCustomer(formData: FormData) {
  try {
    await prisma.customer.update({
      where: { id: Number(formData.get("id")) },
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      },
    });
  } catch (error) {
    console.log("erro ao atualizar", error);
    throw new Error("Erro ao atualizar o cliente.");
  } finally {
    redirect("/customers");
  }
}

export const deleteCustomer = async (customerId: any) => {
  try {
    await prisma.customer.delete({
      where: { id: Number(customerId) },
    });
  } catch (error) {
    throw new Error("Erro ao deletar o cliente.");
  } finally {
    revalidatePath("/customers");
  }
};

export const deleteProduct = async (productId: any) => {
  try {
    await prisma.product.delete({
      where: { id: Number(productId) },
    });
  } catch (error) {
    throw new Error("Erro ao deletar o produto.");
  } finally {
    revalidatePath("/products");
  }
};

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
