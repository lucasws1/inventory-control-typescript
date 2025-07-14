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
import { auth } from "@/lib/auth";

async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }
  return session.user.id;
}

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    const dateValue = formData.get("dateValue") as string;
    const date = new Date(dateValue);
    const isModal = formData.get("isModal") === "true";

    const newProduct = await prisma.product.create({
      data: {
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
        userId,
        StockMovement: {
          create: {
            quantity: Number(formData.get("quantity")),
            date,
            reason: "COMPRA",
            userId,
          },
        },
      },
    });

    if (!isModal) {
      redirect("/products");
    }

    return {
      success: true,
      product: newProduct,
      message: "Produto criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return { success: false, error: "Erro ao criar produto." };
  }
}

export async function createStockMovement(prevState: any, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
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
        userId,
        productId: Number(formData.get("product")),
      },
    });

    if (!isModal) {
      redirect("/stock-movement");
    }

    return {
      success: true,
      stockMovement: newStockMovement,
      message: "Movimentação de estoque criada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar movimentação de estoque:", error);
    return { success: false, error: "Erro ao criar movimentação de estoque." };
  }
}

export async function updateStockMovement(prevState: any, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    const data = {
      id: Number(formData.get("id")),
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
      where: {
        id: data.id,
        userId: userId, // Garantir que só update dados do próprio usuário
      },
      data: data,
    });

    return {
      success: true,
      stockMovement: data,
      message: "Movimentação de estoque atualizada com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao atualizar o movimento de estoque.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao atualizar o movimento de estoque.",
    };
  }
}

export const deleteProduct = async (productId: number) => {
  try {
    const userId = await getCurrentUserId();
    await prisma.product.delete({
      where: {
        id: Number(productId),
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
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

    const userId = await getCurrentUserId();

    const newCustomer = await prisma.customer.create({
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        userId,
      },
    });

    if (!isModal) {
      redirect("/customers");
    }

    return {
      success: true,
      customer: newCustomer,
      message: "Cliente criado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return { success: false, error: "Erro ao criar cliente." };
  }
};

export async function updateCustomer(prevState: any, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
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
      where: {
        id: validatedData.id,
        userId: userId, // Garantir que só update dados do próprio usuário
      },
      data: {
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
      },
    });

    return {
      success: true,
      customer: validatedData,
      message: "Cliente atualizado com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao atualizar o cliente.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao atualizar o cliente.",
    };
  }
}

export async function updateInvoice(prevState: any, formData: FormData) {
  const userId = await getCurrentUserId();
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

  const parseResult = CreateInvoiceSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error("Dados inválidos. Verifique os campos.", parseResult.error);
  }

  try {
    const invoiceUpdate = await prisma.invoice.update({
      where: {
        id: data.id,
        userId: userId, // Garantir que só update dados do próprio usuário
      },
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
            userId,
          })),
        },
      },
    });

    return {
      success: true,
      invoice: invoiceUpdate,
      message: "Venda atualizada com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao atualizar a venda.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao atualizar a venda.",
    };
  }
}

export async function updateProduct(prevState: any, formData: FormData) {
  try {
    const userId = await getCurrentUserId();
    const data = {
      id: Number(formData.get("id")),
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
    };

    await prisma.product.update({
      where: {
        id: data.id,
        userId: userId, // Garantir que só update dados do próprio usuário
      },
      data: {
        name: data.name,
        price: data.price,
      },
    });

    return {
      success: true,
      product: data,
      message: "Produto atualizado com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao atualizar o produto.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao atualizar o produto.",
    };
  }
}

export const deleteCustomer = async (customerId: any) => {
  try {
    const userId = await getCurrentUserId();
    await prisma.customer.delete({
      where: {
        id: Number(customerId),
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
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
    const userId = await getCurrentUserId();
    await prisma.stockMovement.delete({
      where: {
        id: stockMovementId,
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
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
    const userId = await getCurrentUserId();
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
        userId,
        InvoiceItem: {
          create: data.invoiceItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            userId,
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
        userId,
      })),
    });

    if (!isModal) {
      redirect("/invoices");
    }

    return {
      success: true,
      invoice: newInvoice,
      stockMovement: newStockMovement,
      message: "Venda lançada com sucesso!",
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
    const userId = await getCurrentUserId();
    const deleteInvoice = await prisma.invoice.delete({
      where: {
        id: invoiceId,
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
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
    const userId = await getCurrentUserId();
    const deletedInvoices = await prisma.invoice.deleteMany({
      where: {
        id: { in: invoiceId },
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
    });

    return {
      success: true,
      itemsDeleted: deletedInvoices,
      message: "Venda(s) deletada(s) com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar a(s) venda(s).",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar a(s) venda(s).",
    };
  }
};

export const deleteManyProducts = async (productId: number[]) => {
  try {
    const userId = await getCurrentUserId();
    const deletedProducts = await prisma.product.deleteMany({
      where: {
        id: { in: productId },
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
    });
    return {
      success: true,
      itemsDeleted: deletedProducts,
      message: "Produto(s) deletado(s) com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar o(s) produto(s).",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o(s) produto(s).",
    };
  }
};

export const deleteManyCustomers = async (customerId: number[]) => {
  try {
    const userId = await getCurrentUserId();
    const deletedCustomers = await prisma.customer.deleteMany({
      where: {
        id: { in: customerId },
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
    });
    return {
      success: true,
      itemsDeleted: deletedCustomers,
      message: "Cliente(s) deletado(s) com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar o(s) cliente(s).",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o(s) cliente(s).",
    };
  }
};

export const deleteManyStockMovements = async (stockMovementId: number[]) => {
  try {
    const userId = await getCurrentUserId();
    const deletedStockMovements = await prisma.stockMovement.deleteMany({
      where: {
        id: { in: stockMovementId },
        userId: userId, // Garantir que só deleta dados do próprio usuário
      },
    });
    return {
      success: true,
      itemsDeleted: deletedStockMovements,
      message: "Movimento(s) de estoque deletado(s) com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao deletar o(s) movimento(s) de estoque.",
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Erro ao deletar o(s) movimento(s) de estoque.",
    };
  }
};
