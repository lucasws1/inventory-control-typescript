import { PrismaClient, StockReason } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// Função para gerar dados de estoque com volumes menores
function generateStockData(day: number, totalDays: number) {
  // Volumes ainda menores para faturamento realista
  const baseCompra =
    3 + Math.sin((day / totalDays) * Math.PI * 4) * 2 + Math.random() * 3;
  const baseVenda =
    5 + Math.cos((day / totalDays) * Math.PI * 3) * 3 + Math.random() * 4;

  // Adicionar picos e vales ocasionais
  const isWeekend = day % 7 === 0 || day % 7 === 6;
  const isPeak = Math.random() > 0.92; // Ainda menos picos
  const isValley = Math.random() > 0.96; // Ainda menos vales

  let compra = baseCompra;
  let venda = baseVenda;

  if (isPeak) {
    compra *= 2.0;
    venda *= 1.8;
  } else if (isValley) {
    compra *= 0.2;
    venda *= 0.3;
  }

  if (isWeekend) {
    compra *= 0.5;
    venda *= 0.6;
  }

  return {
    compra: Math.round(Math.max(1, compra)),
    venda: Math.round(Math.max(2, venda)),
  };
}

async function main() {
  console.log("🌱 Iniciando seed para usuário demo...");

  // Buscar o usuário demo
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@exemplo.com" },
  });

  if (!demoUser) {
    console.error(
      "❌ Usuário demo não encontrado. Execute primeiro: pnpm run create-demo-user",
    );
    process.exit(1);
  }

  const userId = demoUser.id;
  console.log(`✅ Usuário demo encontrado: ${userId}`);

  // Limpar dados existentes do usuário demo
  console.log("🧹 Limpando dados existentes...");
  await prisma.invoiceItem.deleteMany({ where: { userId } });
  await prisma.invoice.deleteMany({ where: { userId } });
  await prisma.stockMovement.deleteMany({ where: { userId } });
  await prisma.product.deleteMany({ where: { userId } });
  await prisma.customer.deleteMany({ where: { userId } });

  // Configurar período de 90 dias
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 90);

  console.log("📦 Criando produtos...");

  // Criar produtos para o demo com preços mais variados
  const produtos = [
    { name: "Notebook Dell Inspiron 15", price: 2899.99 },
    { name: "Mouse Logitech MX Master 3", price: 349.9 },
    { name: "Teclado Mecânico Corsair K95", price: 899.99 },
    { name: 'Monitor LG UltraWide 34"', price: 1599.99 },
    { name: "Webcam Logitech C920", price: 299.99 },
    { name: "Headset HyperX Cloud II", price: 459.99 },
    { name: "Smartphone Samsung Galaxy S24", price: 3299.99 },
    { name: 'Tablet iPad Air 10.9"', price: 2799.99 },
    { name: "Impressora HP LaserJet Pro", price: 899.99 },
    { name: "Switch TP-Link 8 Portas", price: 189.99 },
    { name: "Pendrive SanDisk 64GB", price: 49.99 },
    { name: "HD Externo Seagate 2TB", price: 399.99 },
    { name: "Fone Bluetooth Sony WH-1000XM4", price: 1299.99 },
    { name: "Smartwatch Apple Watch Series 9", price: 2499.99 },
    { name: "Caixa de Som JBL Charge 5", price: 699.99 },
    { name: "Cabo USB-C 2m", price: 39.99 },
    { name: "Carregador Wireless", price: 129.99 },
    { name: "Suporte para Notebook", price: 89.99 },
    { name: "Mousepad Gamer Grande", price: 79.99 },
    { name: "Webcam Full HD Básica", price: 159.99 },
  ];

  const produtosCriados = [];
  for (let i = 0; i < produtos.length; i++) {
    const produto = produtos[i];
    const createdAt = new Date(startDate.getTime() + i * 86400000 * 2); // Espalhar ao longo do tempo

    const produtoCriado = await prisma.product.create({
      data: {
        name: produto.name,
        price: produto.price,
        userId,
        createdAt,
      },
    });

    produtosCriados.push(produtoCriado);

    // Estoque inicial menor para cada produto
    await prisma.stockMovement.create({
      data: {
        productId: produtoCriado.id,
        quantity: 10 + Math.floor(Math.random() * 30), // 10-40 unidades iniciais
        date: createdAt,
        reason: StockReason.COMPRA,
        userId,
      },
    });
  }

  console.log("👥 Criando clientes...");

  // Criar menos clientes
  const nomes = [
    "João Silva",
    "Maria Santos",
    "Pedro Oliveira",
    "Ana Costa",
    "Carlos Pereira",
    "Lucia Rodrigues",
    "Fernando Almeida",
    "Beatriz Lima",
    "Rafael Barbosa",
    "Camila Cardoso",
    "Diego Ferreira",
    "Isabela Gomes",
  ];

  const clientesCriados = [];
  for (let i = 0; i < nomes.length; i++) {
    const nome = nomes[i];
    const createdAt = new Date(startDate.getTime() + i * 86400000 * 5);

    const cliente = await prisma.customer.create({
      data: {
        name: nome,
        email: `${nome.toLowerCase().replace(" ", ".")}@email.com`,
        phone: `11999${String(i).padStart(6, "0")}`,
        userId,
        createdAt,
      },
    });

    clientesCriados.push(cliente);
  }

  console.log("📊 Gerando movimentações de estoque para 90 dias...");

  // Gerar movimentações diárias com volumes menores
  for (let day = 0; day < 90; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const { compra, venda } = generateStockData(day, 90);

    // Distribuir compras entre produtos aleatórios (volumes menores)
    const numCompras = Math.floor(compra / 2) + 1; // Dividir em lotes menores
    for (let i = 0; i < numCompras; i++) {
      const produto =
        produtosCriados[Math.floor(Math.random() * produtosCriados.length)];
      const quantidade = Math.floor(Math.random() * 3) + 1; // 1-3 unidades apenas

      await prisma.stockMovement.create({
        data: {
          productId: produto.id,
          quantity: quantidade,
          date: new Date(currentDate.getTime() + i * 3600000), // Espalhar ao longo do dia
          reason: StockReason.COMPRA,
          userId,
        },
      });
    }

    // Distribuir vendas entre produtos aleatórios (volumes menores)
    const numVendas = Math.floor(venda / 1.5) + 1; // Dividir em lotes menores
    for (let i = 0; i < numVendas; i++) {
      const produto =
        produtosCriados[Math.floor(Math.random() * produtosCriados.length)];
      const cliente =
        clientesCriados[Math.floor(Math.random() * clientesCriados.length)];
      const quantidade = Math.floor(Math.random() * 2) + 1; // 1-2 unidades apenas

      // Criar invoice
      const invoice = await prisma.invoice.create({
        data: {
          customerId: cliente.id,
          amount: produto.price * quantidade,
          pending: Math.random() > 0.9, // 10% pendentes
          purchaseDate: new Date(currentDate.getTime() + i * 3600000 + 1800000), // Meio dia depois
          userId,
        },
      });

      // Criar invoice item
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          productId: produto.id,
          quantity: quantidade,
          unitPrice: produto.price,
          userId,
        },
      });

      // Movimentação de estoque (VENDA)
      await prisma.stockMovement.create({
        data: {
          productId: produto.id,
          quantity: -quantidade,
          date: new Date(currentDate.getTime() + i * 3600000 + 1800000),
          reason: StockReason.VENDA,
          userId,
        },
      });
    }

    // Ajustes ocasionais menores (3% dos dias)
    if (Math.random() > 0.97) {
      const produto =
        produtosCriados[Math.floor(Math.random() * produtosCriados.length)];
      const quantidade = Math.floor(Math.random() * 3) + 1; // 1-3 unidades
      const isPositive = Math.random() > 0.5;

      await prisma.stockMovement.create({
        data: {
          productId: produto.id,
          quantity: isPositive ? quantidade : -quantidade,
          date: new Date(currentDate.getTime() + 7200000), // 2 horas depois
          reason: isPositive
            ? StockReason.AJUSTE_POSITIVO
            : StockReason.AJUSTE_NEGATIVO,
          userId,
        },
      });
    }
  }

  console.log("✅ Seed concluído!");
  console.log(`📈 Dados gerados para ${produtosCriados.length} produtos`);
  console.log(`👥 ${clientesCriados.length} clientes criados`);
  console.log("📊 90 dias de movimentações de estoque geradas");
  console.log("💰 Faturamento estimado: ~R$ 400-500k");
  console.log("📦 Estoque total estimado: ~1500-2000 itens");
  console.log("🎯 Gráfico deve estar com dados realistas!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
