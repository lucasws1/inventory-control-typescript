"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopCards() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total mês</CardTitle>
          <CardDescription>Junho</CardDescription>
          <CardAction>R$ 12.345,00</CardAction>
        </CardHeader>

        <CardFooter className="flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link
              href={pathname === "/invoices" ? "/" : "/invoices"}
              className="flex items-center gap-2"
            >
              <FileText /> {pathname === "/invoices" ? "Voltar" : "Faturas"}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pendências</CardTitle>
          <CardDescription>32 Faturas</CardDescription>
          <CardAction>R$ 18.325,00</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link
              href={pathname === "/customers" ? "/" : "/customers"}
              className="flex items-center gap-2"
            >
              <Users /> {pathname === "/customers" ? "Voltar" : "Clientes"}
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valor em estoque</CardTitle>
          <CardDescription>240 un. Caixa LP</CardDescription>
          <CardAction>R$ 58.350,00</CardAction>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link
              href={pathname === "/products" ? "/" : "/products"}
              className="flex items-center gap-2"
            >
              <ShoppingCart />
              {pathname === "/products" ? "Voltar" : "Produtos"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
