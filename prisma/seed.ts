import { PrismaClient, StockReason } from "../app/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

const customerData = [
  {
    name: "Paulinho",
    email: "paulinho@gmail.com",
    phone: "53 999994827",
  },
  {
    name: "Beto",
    email: "beto@gmail.com",
    phone: "53 928430291",
  },
  {
    name: "Verônica",
    phone: "52 988885557",
  },
  {
    name: "Cris",
    phone: "51 928492019",
  },
  {
    name: "Fabinho Imp",
    phone: "51 939381739",
  },
  {
    name: "Cassais",
    phone: "51 827482910",
  },
];

const invoiceData = [
  {
    customerId: 1,
    amount: 100.0,
    pending: true,
    purchaseDate: new Date("2023-10-01"),
  },
  {
    customerId: 2,
    amount: 3200.0,
    pending: true,
    purchaseDate: new Date("2023-10-01"),
  },
  {
    customerId: 3,
    amount: 6800.0,
    pending: false,
    purchaseDate: new Date("2023-10-01"),
  },
  {
    customerId: 4,
    amount: 10400.0,
    pending: true,
    purchaseDate: new Date("2023-10-01"),
  },
  {
    customerId: 5,
    amount: 1200.0,
    pending: false,
    purchaseDate: new Date("2023-10-01"),
  },
  {
    customerId: 6,
    amount: 1400.0,
    pending: false,
    purchaseDate: new Date("2023-10-01"),
  },
];

const productData = [
  {
    name: "Caixa LP",
    price: 360.0,
  },
  {
    name: "Caixa LG",
    price: 360.0,
  },
  {
    name: "Caneta",
    price: 80.0,
  },
  {
    name: "Bolinha",
    price: 3600.0,
  },
  {
    name: "Caixa de Canetas",
    price: 3800.0,
  },
];

const invoiceItemData = [
  {
    invoiceId: 3,
    productId: 1,
    unitPrice: 360.0,
    quantity: 2,
  },
  {
    invoiceId: 3,
    productId: 2,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 4,
    productId: 3,
    unitPrice: 80.0,
    quantity: 5,
  },
  {
    invoiceId: 4,
    productId: 4,
    unitPrice: 3600.0,
    quantity: 1,
  },
  {
    invoiceId: 5,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 2,
  },
  {
    invoiceId: 5,
    productId: 1,
    unitPrice: 360.0,
    quantity: 3,
  },
  {
    invoiceId: 6,
    productId: 2,
    unitPrice: 420.0,
    quantity: 4,
  },
  {
    invoiceId: 6,
    productId: 3,
    unitPrice: 3600.0,
    quantity: 2,
  },
  {
    invoiceId: 7,
    productId: 4,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 7,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 3,
  },
  {
    invoiceId: 8,
    productId: 1,
    unitPrice: 360.0,
    quantity: 2,
  },
  {
    invoiceId: 8,
    productId: 2,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 9,
    productId: 3,
    unitPrice: 80.0,
    quantity: 5,
  },
  {
    invoiceId: 9,
    productId: 4,
    unitPrice: 3600.0,
    quantity: 1,
  },
  {
    invoiceId: 10,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 2,
  },
  {
    invoiceId: 11,
    productId: 1,
    unitPrice: 360.0,
    quantity: 3,
  },
  {
    invoiceId: 11,
    productId: 2,
    unitPrice: 420.0,
    quantity: 4,
  },
  {
    invoiceId: 12,
    productId: 3,
    unitPrice: 3600.0,
    quantity: 2,
  },
  {
    invoiceId: 12,
    productId: 4,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 12,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 3,
  },
  {
    invoiceId: 13,
    productId: 1,
    unitPrice: 360.0,
    quantity: 2,
  },
  {
    invoiceId: 13,
    productId: 2,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 14,
    productId: 3,
    unitPrice: 80.0,
    quantity: 5,
  },
  {
    invoiceId: 14,
    productId: 4,
    unitPrice: 3600.0,
    quantity: 1,
  },
  {
    invoiceId: 15,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 2,
  },
  {
    invoiceId: 15,
    productId: 1,
    unitPrice: 360.0,
    quantity: 3,
  },
  {
    invoiceId: 16,
    productId: 2,
    unitPrice: 420.0,
    quantity: 4,
  },
  {
    invoiceId: 16,
    productId: 3,
    unitPrice: 3600.0,
    quantity: 2,
  },
  {
    invoiceId: 17,
    productId: 4,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 17,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 3,
  },
  {
    invoiceId: 18,
    productId: 1,
    unitPrice: 360.0,
    quantity: 2,
  },
  {
    invoiceId: 18,
    productId: 2,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 19,
    productId: 3,
    unitPrice: 80.0,
    quantity: 5,
  },
  {
    invoiceId: 19,
    productId: 4,
    unitPrice: 3600.0,
    quantity: 1,
  },
  {
    invoiceId: 20,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 2,
  },
  {
    invoiceId: 20,
    productId: 1,
    unitPrice: 360.0,
    quantity: 3,
  },
  {
    invoiceId: 15,
    productId: 2,
    unitPrice: 420.0,
    quantity: 4,
  },
  {
    invoiceId: 16,
    productId: 3,
    unitPrice: 3600.0,
    quantity: 2,
  },
  {
    invoiceId: 17,
    productId: 4,
    unitPrice: 420.0,
    quantity: 1,
  },
  {
    invoiceId: 18,
    productId: 5,
    unitPrice: 3800.0,
    quantity: 3,
  },
];

const stockMovementData = [
  {
    productId: 1,
    quantity: 100,
    date: new Date("2023-10-01"),
    reason: StockReason.COMPRA,
  },
  {
    productId: 2,
    quantity: 50,
    date: new Date("2023-10-01"),
    reason: StockReason.COMPRA,
  },
  {
    productId: 1,
    quantity: 10,
    date: new Date("2023-10-01"),
    reason: StockReason.VENDA,
  },
  {
    productId: 2,
    quantity: 10,
    date: new Date("2023-10-01"),
    reason: StockReason.VENDA,
  },
  {
    productId: 3,
    quantity: 10,
    date: new Date("2023-10-01"),
    reason: StockReason.VENDA,
  },
  {
    productId: 4,
    quantity: 10,
    date: new Date("2023-10-01"),
    reason: StockReason.COMPRA,
  },
  {
    productId: 5,
    quantity: 10,
    date: new Date("2023-10-01"),
    reason: StockReason.COMPRA,
  },
];

export async function main() {
  // for (const c of customerData) {
  //   await prisma.customer.create({ data: c });
  // }

  // for (const i of invoiceData) {
  //   await prisma.invoice.create({ data: i });
  // }

  // for (const p of productData) {
  //   await prisma.product.create({ data: p });
  // }

  for (const item of invoiceItemData) {
    await prisma.invoiceItem.create({ data: item });
  }

  for (const sm of stockMovementData) {
    await prisma.stockMovement.create({ data: sm });
  }

  console.log(
    ":) Invoices, Products, Invoice Items, and Stock Movements seeded successfully.",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
