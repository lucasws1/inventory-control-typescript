import prisma from "@/lib/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

type PageProps = {
  id: string;
};

export const metadata: Metadata = {
  title: "Editar Cliente",
};

export default async function CustomerPage({ params }: { params: PageProps }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  return (
    <form action={updateCustomer}>
      <div className="mx-2 flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Alterar dados</CardTitle>
            <CardDescription>
              Alterado em {customer?.updatedAt?.toLocaleDateString("pt-BR")}
            </CardDescription>
            <CardAction>
              <Button variant={"link"}>Ver faturas</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input type="hidden" name="id" value={customer?.id} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={customer?.name as string}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={customer?.email as string}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  defaultValue={customer?.phone as string}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Enviar
            </Button>
            <Button variant="outline" className="w-full">
              <Link href="/customers">Retornar para Clientes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
