import prisma from "@/lib/prisma";
import { endOfMonth } from "date-fns/endOfMonth";
import { startOfMonth } from "date-fns/startOfMonth";
import CardFromTopCards from "./cardFromTopCards";
import { CardBody, CardWithGridEllipsis } from "./cardWithGridEllipsis";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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

  const cardContent = {
    title: "Vendas",
    description: "Número mensal de vendas:",
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <CardFromTopCards
        title={"Vendas"}
        info={`${invoices.length}`}
        subtitle={"No mês"}
      />

      <CardFromTopCards
        title={"Clientes"}
        info={`${customers.length}`}
        subtitle={"Cadastrados"}
      />

      <CardFromTopCards
        title={"Produtos"}
        info={`${products.length}`}
        subtitle={"Cadastrados"}
      />
      <CardFromTopCards
        title={"Estoque"}
        info={`${stockMovements.length}`}
        subtitle={"Movimentações"}
      />
    </div>
  );
}
