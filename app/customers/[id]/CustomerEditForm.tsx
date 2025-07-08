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
import { useDraggable } from "@/hooks/useDraggable";
import { CustomerWithRelations } from "@/types/CustomerWithRelations";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

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
  const router = useRouter();
  const { position, dragHandleProps } = useDraggable();
  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/customers");
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
            <CardHeader {...dragHandleProps}>
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

                <div className="grid gap-2">
                  <Label htmlFor="createdAt">Data de cadastro</Label>
                  <Input
                    id="createdAt"
                    name="createdAt"
                    type="text"
                    disabled
                    defaultValue={
                      customer?.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Data não disponível"
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="updatedAt">Última edição</Label>
                  <Input
                    id="updatedAt"
                    name="updatedAt"
                    type="text"
                    disabled
                    defaultValue={
                      customer?.updatedAt
                        ? new Date(customer.updatedAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Data não disponível"
                    }
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={handleCloseModal}
              >
                Enviar
              </Button>
              <Button
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
  // Retorna o formulário em modal ou modo normal
  if (isModal) {
    return (
      <>
        {/* Modal Backdrop */}
        <div
          className="scrollbar-hidden fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="scrollbar-hidden relative max-h-[90vh] w-full max-w-sm overflow-y-auto"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            {renderForm()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
