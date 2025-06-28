"use server";

import prisma from "@/lib/prisma";
import {
  CustomerSchema,
  CustomerUpdateSchema,
  StockMovementUpdateSchema,
} from "@/schemas/zodSchemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const dateValue = formData.get("dateValue") as string;
    const date = new Date(dateValue);
    const newProduct = await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
        StockMovement: {
          create: {
            quantity: Number(formData.get("quantity")),
            date,
            reason: "COMPRA",
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Erro ao criar produto.");
  } finally {
    redirect("/products");
  }
}

export async function createStockMovement(prevState: any, formData: FormData) {
  try {
    await prisma.stockMovement.create({
      data: {
        quantity: Number(formData.get("quantity")),
        date: new Date(formData.get("dateValue") as string),
        reason: formData.get("reason") as
          | "COMPRA"
          | "VENDA"
          | "AJUSTE_POSITIVO"
          | "AJUSTE_NEGATIVO",
        Product: {
          connect: { id: Number(formData.get("product")) },
        },
      },
    });
    console.log("sucesso");
  } catch (error) {
    console.log(error);

    throw new Error("Erro ao criar cliente.");
  } finally {
    redirect("/stock-movement");
  }
}

export async function updateStockMovement(prevState: any, formData: FormData) {
  try {
    const data = {
      quantity: Number(formData.get("quantity")) as number,
      date: new Date(formData.get("dateValue") as string),
      reason: formData.get("reason") as
        | "COMPRA"
        | "VENDA"
        | "AJUSTE_POSITIVO"
        | "AJUSTE_NEGATIVO",
    };

    const parseResult = StockMovementUpdateSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Dados inválidos. Verifique os campos.");
    }

    await prisma.stockMovement.update({
      where: { id: Number(formData.get("id")) },
      data: data,
    });
  } catch (error) {
    throw new Error("Erro ao atualizar o cliente.");
  } finally {
    redirect("/stock-movement");
  }
}

export const deleteProduct = async (productId: number) => {
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

export const createCustomer = async (prevState: any, formData: FormData) => {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const parseResult = CustomerSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Dados inválidos. Verifique os campos.");
    }

    await prisma.customer.create({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      },
    });
  } catch (error) {
    throw new Error("Erro ao criar cliente.");
  } finally {
    redirect("/customers");
  }
};

export async function updateCustomer(prevState: any, formData: FormData) {
  try {
    const data = {
      id: Number(formData.get("id")),
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const parseResult = CustomerUpdateSchema.safeParse(data);
    if (!parseResult.success) {
      throw new Error("Dados inválidos. Verifique os campos.");
    }

    const emailValue = data.email.trim() === "" ? null : data.email;

    await prisma.customer.update({
      where: { id: Number(formData.get("id")) },
      data: { ...data, email: emailValue },
      // data: {
      //   name: formData.get("name") as string,
      //   email: emailValue,
      //   phone: formData.get("phone") as string,
      // },
    });
  } catch (error) {
    throw new Error("Erro ao atualizar o cliente.");
  } finally {
    redirect("/customers");
  }
}

export async function updateProduct(prevState: any, formData: FormData) {
  try {
    const data = {
      id: Number(formData.get("id")),
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
    };

    await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        price: data.price,
      },
    });
  } catch (error) {
    throw new Error("Erro ao atualizar o produto.");
  } finally {
    redirect("/products");
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

export const deleteStockMovement = async (stockMovementId: number) => {
  try {
    await prisma.stockMovement.delete({
      where: { id: stockMovementId },
    });
  } catch (error) {
    throw new Error("Erro ao deletar o produto.");
  } finally {
    revalidatePath("stock-movement");
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
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar a venda.",
    };
  }
};
