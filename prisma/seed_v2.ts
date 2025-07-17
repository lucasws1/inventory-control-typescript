import { PrismaClient, StockReason } from "../app/generated/prisma";

const prisma = new PrismaClient();

// Helper function to generate random date within a range
function randomDateBetween(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// Helper function to generate random number between min and max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mock data for the last 180 days
export async function generateMockData() {
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 180);

  console.log("🌱 Generating balanced mock data for the last 180 days...");

  // 1. Generate customers evenly distributed
  const numCustomers = 50;
  const mockCustomers = [];
  for (let i = 0; i < numCustomers; i++) {
    const createdAt = new Date(
      startDate.getTime() +
        ((now.getTime() - startDate.getTime()) * i) / numCustomers,
    );
    mockCustomers.push({
      name: `Cliente ${i + 1}`,
      email: `cliente${i + 1}@email.com`,
      phone: `51999${String(i).padStart(6, "0")}`,
      createdAt,
    });
  }

  // 2. Generate products evenly distributed
  const productNames = [
    "Notebook Dell",
    "Mouse Logitech",
    "Teclado Mecânico",
    'Monitor 24"',
    "Webcam HD",
    "Headset Gamer",
    "Smartphone Samsung",
    "Tablet iPad",
    "Carregador USB-C",
    "Cabo HDMI",
    "SSD 1TB",
    "Memória RAM 16GB",
    "Placa de Vídeo",
    "Processador Intel",
    "Cooler CPU",
    "Fonte 650W",
    "Gabinete Gamer",
    "Mousepad",
    "Mesa Gamer",
    "Cadeira Office",
    "Impressora Laser",
    "Scanner",
    "Roteador WiFi",
    "Switch 8 Portas",
    "Pendrive 64GB",
    "HD Externo 2TB",
    "Fone Bluetooth",
    "Smartwatch",
    "Caixa de Som",
    "Microfone",
    "Ring Light",
    "Tripé",
    "Power Bank",
  ];
  const numProducts = productNames.length;
  const mockProducts = [];
  for (let i = 0; i < numProducts; i++) {
    const createdAt = new Date(
      startDate.getTime() +
        ((now.getTime() - startDate.getTime()) * i) / numProducts,
    );
    mockProducts.push({
      name: productNames[i],
      price: randomBetween(50, 5000),
      createdAt,
    });
  }

  // 3. Clear existing data
  console.log("🗑️ Cleaning existing data...");
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // 4. Insert customers
  console.log("👥 Creating customers...");
  const createdCustomers = [];
  for (const customer of mockCustomers) {
    const created = await prisma.customer.create({
      data: {
        ...customer,
        userId: "default-user-id",
      },
    });
    createdCustomers.push(created);
  }

  // 5. Insert products with initial stock movements
  console.log("📦 Creating products...");
  const createdProducts = [];
  for (const product of mockProducts) {
    const created = await prisma.product.create({
      data: {
        ...product,
        userId: "default-user-id",
      },
    });
    createdProducts.push(created);
    // Add initial stock for each product (purchase)
    await prisma.stockMovement.create({
      data: {
        productId: created.id,
        quantity: 100,
        date: new Date(product.createdAt.getTime() + 1000 * 60 * 60),
        reason: StockReason.COMPRA,
        userId: "default-user-id",
      },
    });
  }

  // 6. Generate invoices and stock movements evenly for each day
  console.log("🧾 Creating invoices and stock movements...");
  for (let day = 0; day < 180; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);

    // 2 vendas por dia, sempre
    for (let i = 0; i < 2; i++) {
      // Clientes e produtos disponíveis até a data
      const availableCustomers = createdCustomers.filter(
        (c) => c.createdAt <= currentDate,
      );
      const availableProducts = createdProducts.filter(
        (p) => p.createdAt <= currentDate,
      );
      if (availableCustomers.length === 0 || availableProducts.length === 0)
        continue;

      const customer =
        availableCustomers[(day * 2 + i) % availableCustomers.length];
      // 1-2 produtos por venda
      const numItems = randomBetween(1, 2);
      const selectedProducts = [];
      for (let j = 0; j < numItems; j++) {
        const product =
          availableProducts[(day + i + j) % availableProducts.length];
        const quantity = randomBetween(1, 3);
        const unitPrice = product.price * (0.9 + Math.random() * 0.2); // ±10%
        selectedProducts.push({ product, quantity, unitPrice });
      }
      const totalAmount = selectedProducts.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      // Cria invoice
      const invoice = await prisma.invoice.create({
        data: {
          customerId: customer.id,
          amount: totalAmount,
          pending: Math.random() > 0.8, // 20% pendente
          purchaseDate: new Date(currentDate.getTime() + i * 1000 * 60 * 60),
          userId: "default-user-id",
        },
      });
      // Cria invoice items e movimentação de estoque
      for (const item of selectedProducts) {
        await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            userId: "default-user-id",
          },
        });
        await prisma.stockMovement.create({
          data: {
            productId: item.product.id,
            quantity: -item.quantity,
            date: invoice.purchaseDate,
            reason: StockReason.VENDA,
            userId: "default-user-id",
          },
        });
      }
    }
    // Entrada de estoque extra a cada 10 dias
    if (day % 10 === 0) {
      const availableProducts = createdProducts.filter(
        (p) => p.createdAt <= currentDate,
      );
      if (availableProducts.length > 0) {
        const product = availableProducts[day % availableProducts.length];
        await prisma.stockMovement.create({
          data: {
            productId: product.id,
            quantity: randomBetween(10, 30),
            date: new Date(currentDate.getTime() + 1000 * 60 * 30),
            reason: StockReason.COMPRA,
            userId: "default-user-id",
          },
        });
      }
    }
  }

  console.log("✅ Balanced mock data generated successfully!");
  console.log(`📊 Created:`);
  console.log(`   • ${createdCustomers.length} customers`);
  console.log(`   • ${createdProducts.length} products`);
  const invoiceCount = await prisma.invoice.count();
  const stockMovementCount = await prisma.stockMovement.count();
  const invoiceItemCount = await prisma.invoiceItem.count();
  console.log(`   • ${invoiceCount} invoices`);
  console.log(`   • ${invoiceItemCount} invoice items`);
  console.log(`   • ${stockMovementCount} stock movements`);
}

// Keep existing data for reference
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
  // Generate comprehensive mock data for charts
  await generateMockData();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
