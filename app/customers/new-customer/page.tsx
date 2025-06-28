"use client";
import { createCustomer } from "@/app/lib/actions";
import OverlaySpinner from "@/components/overlaySpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomer() {
  const [state, formAction, pending] = useActionState(createCustomer, null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = () => {
    setLoading(true);
    router.push("/customers");
  };

  return (
    <>
      {loading ? <OverlaySpinner /> : ""}
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cadastrar novo cliente</CardTitle>
          <CardDescription>Insira os dados abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" type="text" placeholder="Lucas" name="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="lucas@example.com"
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(99) 99999-9999"
                  name="phone"
                />
              </div>
              <div className="relative flex flex-col gap-2">
                <Button type="submit" className="w-full cursor-pointer">
                  Cadastrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleReturn}
                >
                  Retornar à lista de clientes
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
