import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomersDropdownButton from "./customersDropdownButton";
import InvoicesDropdownButton from "./invoicesDropdownButton";
import ProductsDropdownButton from "./productsDropdownButton";
import StockMovementDropdownButton from "./stockMovementDropDownButton";
import prisma from "@/lib/prisma";
import { endOfMonth } from "date-fns/endOfMonth";
import { startOfMonth } from "date-fns/startOfMonth";

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
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <CardDescription>Em {currentMonth}</CardDescription>
          <CardAction>{invoices.length} vendas</CardAction>
        </CardHeader>

        <CardFooter className="flex justify-center">
          <InvoicesDropdownButton />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Clientes cadastrados</CardDescription>
          <CardAction>{customers.length} clientes</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <CustomersDropdownButton />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>Itens cadastrados</CardDescription>
          <CardAction>{products.length} itens</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <ProductsDropdownButton />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estoque</CardTitle>
          <CardDescription>Andamentos registrados</CardDescription>
          <CardAction>{stockMovements.length} andamentos</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <StockMovementDropdownButton />
        </CardFooter>
      </Card>
    </div>
  );
}
