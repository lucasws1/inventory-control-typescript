"use server";

import prisma from "@/lib/prisma";
import {
  CreateInvoiceSchema,
  CustomerSchema,
  CustomerUpdateSchema,
  InvoiceSchema,
  StockMovementUpdateSchema,
} from "@/schemas/zodSchemas";
import { InvoiceItem } from "@/types/invoiceItem";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const dateValue = formData.get("dateValue") as string;
    const date = new Date(dateValue);
    const isModal = formData.get("isModal") === "true";

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

    if (!isModal) {
      redirect("/products");
    }

    return { success: true, product: newProduct };
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return { success: false, error: "Erro ao criar produto." };
  }
}

export async function createStockMovement(prevState: any, formData: FormData) {
  try {
    const isModal = formData.get("isModal") === "true";

    const newStockMovement = await prisma.stockMovement.create({
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

    if (!isModal) {
      redirect("/stock-movement");
    }

    return { success: true, stockMovement: newStockMovement };
  } catch (error) {
    console.error("Erro ao criar movimentação de estoque:", error);
    return { success: false, error: "Erro ao criar movimentação de estoque." };
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
    revalidatePath("/products", "page");
    revalidatePath("/", "layout");
  }
};

export const createCustomer = async (prevState: any, formData: FormData) => {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const isModal = formData.get("isModal") === "true";

    const parseResult = CustomerSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: "Dados inválidos. Verifique os campos." };
    }

    const validatedData = parseResult.data;

    const newCustomer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
      },
    });

    if (!isModal) {
      redirect("/customers");
    }

    return { success: true, customer: newCustomer };
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return { success: false, error: "Erro ao criar cliente." };
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

    const validatedData = parseResult.data;

    await prisma.customer.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
      },
    });
  } catch (error) {
    throw new Error("Erro ao atualizar o cliente.");
  } finally {
    redirect("/customers");
  }
}

export async function updateInvoice(prevState: any, formData: FormData) {
  const invoiceItems: InvoiceItem[] = JSON.parse(
    formData.get("invoiceItems") as string,
  );

  const amount = invoiceItems.reduce(
    (acc: number, invItem: InvoiceItem) =>
      acc + invItem.quantity * invItem.unitPrice,
    0,
  );

  const data = {
    id: Number(formData.get("id")),
    amount,
    pending: formData.get("pending") === "true",
    purchaseDate: new Date(formData.get("date") as string),
    customerId: Number(formData.get("customer")),
    invoiceItems,
  };
  console.log(data);

  const parseResult = CreateInvoiceSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Dados inválidos. Verifique os campos.", parseResult.error);
  }

  try {
    const invoiceUpdate = await prisma.invoice.update({
      where: { id: data.id },
      data: {
        amount: data.amount,
        pending: data.pending,
        purchaseDate: data.purchaseDate,
        customerId: data.customerId,
        InvoiceItem: {
          deleteMany: {}, // Remove todos os itens existentes da invoice
          create: data.invoiceItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });
  } catch (error) {
    throw new Error("Erro ao atualizar invoice.");
  } finally {
    redirect("/invoices");
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
    revalidatePath("/customers", "page");
    revalidatePath("/", "layout");
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
    revalidatePath("/stock-movement", "page");
    revalidatePath("/", "layout");
  }
};

export const createInvoice = async (prevState: any, formData: FormData) => {
  try {
    const invoiceItems = JSON.parse(formData.get("invoiceItems") as string);
    const stockMovement = JSON.parse(formData.get("stockMovement") as string);
    const isModal = formData.get("isModal") === "true";

    const amount = invoiceItems.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.unitPrice;
    }, 0);

    const data = {
      amount,
      pending: formData.get("pending") === "true",
      purchaseDate: new Date(formData.get("date") as string),
      customerId: Number(formData.get("customer")),
      invoiceItems,
    };

    const parseResult = CreateInvoiceSchema.safeParse(data);
    if (!parseResult.success) {
      return {
        success: false,
        error: "Dados inválidos. Verifique os campos.",
      };
    }

    const newInvoice = await prisma.invoice.create({
      data: {
        amount: data.amount,
        pending: data.pending,
        purchaseDate: data.purchaseDate,
        customerId: data.customerId,
        InvoiceItem: {
          create: data.invoiceItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        InvoiceItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    const newStockMovement = await prisma.stockMovement.createMany({
      data: stockMovement.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        date: item.date,
        reason: item.reason,
      })),
    });

    if (!isModal) {
      redirect("/invoices");
    }

    return {
      success: true,
      message: "Venda lançada com sucesso!",
      invoice: newInvoice,
      newStockMovement,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return {
      success: false,
      error: "Erro ao lançar a venda.",
    };
  }
};

export const deleteInvoice = async (invoiceId: number) => {
  try {
    const deleteInvoice = await prisma.invoice.delete({
      where: { id: invoiceId },
    });

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

export const deleteManyInvoices = async (invoiceId: number[]) => {
  try {
    await prisma.invoice.deleteMany({
      where: {
        id: { in: invoiceId },
      },
    });
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

export const deleteManyProducts = async (productId: number[]) => {
  try {
    await prisma.product.deleteMany({
      where: {
        id: { in: productId },
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o produto.",
    };
  }
};

export const deleteManyCustomers = async (customerId: number[]) => {
  try {
    await prisma.customer.deleteMany({
      where: {
        id: { in: customerId },
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o cliente.",
    };
  }
};

export const deleteManyStockMovements = async (stockMovementId: number[]) => {
  try {
    await prisma.stockMovement.deleteMany({
      where: {
        id: { in: stockMovementId },
      },
    });
  } catch (error) {
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o movimento de estoque.",
    };
  }
};
