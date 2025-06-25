"use client";
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

export default function TopCards() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
          <CardDescription>Junho de 2025</CardDescription>
          <CardAction>R$ 12.345,00</CardAction>
        </CardHeader>

        <CardFooter className="flex justify-center">
          <InvoicesDropdownButton />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Valor Pendente</CardDescription>
          <CardAction>R$ 18.325,00</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <CustomersDropdownButton />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>Itens cadastrados</CardDescription>
          <CardAction>8 itens</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <ProductsDropdownButton />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estoque</CardTitle>
          <CardDescription>R$ 58.350,00</CardDescription>
          <CardAction>220 unidades</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <StockMovementDropdownButton />
        </CardFooter>
      </Card>
    </div>
  );
}
