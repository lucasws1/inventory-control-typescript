import prisma from "@/lib/prisma";
import { endOfMonth } from "date-fns/endOfMonth";
import { startOfMonth } from "date-fns/startOfMonth";
import CardFromTopCards from "./cardFromTopCards";

const now = new Date();
const firstDay = startOfMonth(now);
const lastDay = endOfMonth(now);
const currentMonth = now.toLocaleString("pt-BR", {
  month: "long",
  year: "numeric",
});

export default async function TopCards() {
  const [customers, invoices, products, stockMovements] = await Promise.all([
    prisma.customer.findMany(),
    prisma.invoice.findMany({
      where: {
        purchaseDate: {
          gte: firstDay,
          lt: lastDay,
        },
      },
    }),
    prisma.product.findMany(),
    prisma.stockMovement.findMany(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <CardFromTopCards
        title={"Vendas"}
        info={`${invoices.length} vendas`}
        subtitle={"Neste mês"}
      />

      <CardFromTopCards
        title={"Clientes"}
        info={`${customers.length} clientes`}
        subtitle={"Clientes cadastrados"}
      />

      <CardFromTopCards
        title={"Produtos"}
        info={`${products.length} itens`}
        subtitle={"Itens cadastrados"}
      />
      <CardFromTopCards
        title={"Estoque"}
        info={`${stockMovements.length} andamentos`}
        subtitle={"Movimentações"}
      />
    </div>
  );
}
