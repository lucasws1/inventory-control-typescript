"use client";
import { updateCustomer } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from "@/types/customer";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function CustomerEditForm({ customer }: { customer: Customer }) {
  const [state, formAction, pending] = useActionState(updateCustomer, null);
  return (
    <form action={formAction}>
      <div className="mx-2 flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Alterar dados de {customer?.name}</CardTitle>
            <CardDescription>
              Última edição em{" "}
              {customer?.updatedAt?.toLocaleDateString("pt-BR")}
            </CardDescription>
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
            <Button type="submit" className="w-full cursor-pointer">
              {pending ? (
                <Loader className="h-12 w-12 animate-spin" />
              ) : (
                "Enviar"
              )}
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
