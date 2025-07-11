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
import { CustomerWithRelations } from "@/types/CustomerWithRelations";
import { useActionState, useEffect } from "react";

export default function CustomerEditForm({
  customer,
  isModal = false,
  onClose,
}: {
  customer: CustomerWithRelations;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCustomer, null);
  const { refreshData } = useData();

  useEffect(() => {
    if (state?.success) {
      const refresh = async () => await refreshData();
      handleCloseModal();
      refresh();
    }
  }, [state]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderForm = () => (
    <div>
      <form action={formAction}>
        <div className="mx-2 flex justify-center">
          <Card
            className="w-full max-w-sm"
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
                  <Label htmlFor="invoices">Compras</Label>
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
                onClick={handleCloseModal}
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
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
