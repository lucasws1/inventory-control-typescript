import { PrismaClient, StockReason } from "../app/generated/prisma";

const prisma = new PrismaClient();
const USER_ID = "cmcyvm61e000lxl0vgc2mplxx";

// Função para gerar nomes aleatórios de clientes
function generateCustomerName(i: number) {
  const firstNames = [
    "Lucas",
    "Maria",
    "João",
    "Ana",
    "Pedro",
    "Paula",
    "Carlos",
    "Bruna",
    "Marcos",
    "Juliana",
  ];
  const lastNames = [
    "Silva",
    "Souza",
    "Oliveira",
    "Pereira",
    "Costa",
    "Santos",
    "Rodrigues",
    "Almeida",
    "Barbosa",
    "Cardoso",
  ];
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  return `${fn} ${ln} ${i + 1}`;
}

// Função para gerar nomes aleatórios de produtos
function generateProductName(i: number) {
  const types = [
    "Notebook",
    "Mouse",
    "Teclado",
    "Monitor",
    "Webcam",
    "Headset",
    "Smartphone",
    "Tablet",
    "Impressora",
    "Switch",
    "Pendrive",
    "HD Externo",
    "Fone Bluetooth",
    "Smartwatch",
    "Caixa de Som",
    "Microfone",
    "Ring Light",
    "Tripé",
    "Power Bank",
    "Scanner",
  ];
  return `${types[i % types.length]} Modelo ${Math.floor(i / types.length) + 1}`;
}

// Função para criar uma curva oscilante para vendas diárias
function salesWave(day: number, totalDays: number) {
  const base = Math.sin((day / totalDays) * Math.PI * 2) * 1.2 + 2;
  const noise = Math.random() * 0.8 - 0.4;
  const promo = day % 30 < 3 ? 2 : 0;
  const weekend = [6, 0].includes(
    new Date(Date.now() - (totalDays - day) * 86400000).getDay(),
  )
    ? 1
    : 0;
  return Math.max(0, Math.round(base + noise + promo + weekend));
}

async function main() {
  const now = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 180);
  const totalDays = 180;

  // Limpar dados antigos
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // Criar clientes (130) distribuídos ao longo do tempo
  const clientes = [];
  for (let i = 0; i < 130; i++) {
    const createdAt = new Date(
      start.getTime() + ((now.getTime() - start.getTime()) * i) / 130,
    );
    clientes.push(
      await prisma.customer.create({
        data: {
          name: generateCustomerName(i),
          email: `cliente${i + 1}@email.com`,
          phone: `51999${String(i).padStart(6, "0")}`,
          createdAt,
          userId: USER_ID,
        },
      }),
    );
  }

  // Criar produtos (150) distribuídos
  const produtos = [];
  for (let i = 0; i < 150; i++) {
    const createdAt = new Date(
      start.getTime() + ((now.getTime() - start.getTime()) * i) / 150,
    );
    const produto = await prisma.product.create({
      data: {
        name: generateProductName(i),
        price: Math.round((50 + Math.random() * 4950) * 100) / 100,
        createdAt,
        userId: USER_ID,
      },
    });
    produtos.push(produto);
    // Estoque inicial
    await prisma.stockMovement.create({
      data: {
        productId: produto.id,
        quantity: 100 + Math.floor(Math.random() * 20),
        date: new Date(createdAt.getTime() + 3600000),
        reason: StockReason.COMPRA,
        userId: USER_ID,
      },
    });
  }

  // Simular vendas diárias com oscilações
  for (let d = 0; d < totalDays; d++) {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + d);

    const numSales = salesWave(d, totalDays);

    for (let s = 0; s < numSales; s++) {
      // Cliente aleatório já cadastrado até a data
      const availableClients = clientes.filter((c) => c.createdAt <= dayDate);
      if (availableClients.length === 0) continue;
      const cliente =
        availableClients[Math.floor(Math.random() * availableClients.length)];

      // 1 ou 2 produtos por venda
      const numItems = Math.floor(Math.random() * 2) + 1;
      let items = [];
      let total = 0;
      const prods = [...produtos]
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      for (const prod of prods) {
        const qtd = Math.floor(Math.random() * 2) + 1;
        const price =
          Math.round(prod.price * (0.9 + Math.random() * 0.2) * 100) / 100;
        items.push({ productId: prod.id, quantity: qtd, unitPrice: price });
        total += qtd * price;
      }
      const pending = Math.random() > 0.8;
      const invoice = await prisma.invoice.create({
        data: {
          customerId: cliente.id,
          amount: Math.round(total * 100) / 100,
          pending,
          purchaseDate: dayDate,
          userId: USER_ID,
        },
      });

      for (const item of items) {
        await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            userId: USER_ID,
          },
        });
        // Movimentação de estoque (VENDA)
        await prisma.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: -item.quantity,
            date: dayDate,
            reason: StockReason.VENDA,
            userId: USER_ID,
          },
        });
      }
    }

    // A cada 30 dias, entrada de estoque para um produto aleatório
    if (d % 30 === 0) {
      const prod = produtos[Math.floor(Math.random() * produtos.length)];
      await prisma.stockMovement.create({
        data: {
          productId: prod.id,
          quantity: 15 + Math.floor(Math.random() * 10),
          date: new Date(dayDate.getTime() + 7200000),
          reason: StockReason.COMPRA,
          userId: USER_ID,
        },
      });
    }

    // Ajustes positivos/negativos a cada 45 dias
    if (d % 45 === 0) {
      const prod = produtos[Math.floor(Math.random() * produtos.length)];
      await prisma.stockMovement.create({
        data: {
          productId: prod.id,
          quantity:
            (Math.random() > 0.5 ? 1 : -1) *
            (2 + Math.floor(Math.random() * 5)),
          date: new Date(dayDate.getTime() + 3600000 * 4),
          reason:
            Math.random() > 0.5
              ? StockReason.AJUSTE_POSITIVO
              : StockReason.AJUSTE_NEGATIVO,
          userId: USER_ID,
        },
      });
    }
  }

  console.log("✅ Mock data gerado para ~130 clientes e ~150 produtos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
