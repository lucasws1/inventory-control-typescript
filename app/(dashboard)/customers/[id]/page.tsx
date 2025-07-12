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
import { useData } from "@/contexts/DataContext";
import { useActionState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function CustomerEditForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [state, formAction, pending] = useActionState(updateCustomer, null);
  const { refreshData } = useData();
  const { customers } = useData();
  const { id } = use(params);
  const router = useRouter();

  const customer = customers.find((customer) => customer.id === parseInt(id));

  useEffect(() => {
    if (state?.success) {
      const refresh = async () => await refreshData();
      router.push("/customers");
      refresh();
    }
  }, [state]);

  const renderForm = () => (
    <div>
      <form action={formAction}>
        <div className="mx-2 flex justify-center">
          <Card
            className="w-full min-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Alterar dados de {customer?.name}</CardTitle>
              <CardDescription>
                Última edição em{" "}
                {customer?.updatedAt
                  ? new Date(customer.updatedAt).toLocaleDateString("pt-BR")
                  : "Data não disponível"}
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
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={customer?.email as string}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (opcional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="phone"
                    defaultValue={customer?.phone as string}
                  />
                </div>

                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="invoices">Número de compras</Label>
                  <Input
                    id="invoices"
                    name="invoices"
                    type="number"
                    disabled
                    defaultValue={customer?.Invoice.length || 0}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Enviar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => router.push("/customers")}
              >
                Fechar janela
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black/90">
        {renderForm()}
      </div>
    </>
  );
}
