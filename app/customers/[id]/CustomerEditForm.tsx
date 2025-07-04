"use client";
import { updateCustomer } from "@/app/lib/actions";
import OverlaySpinner from "@/components/overlaySpinner";
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
import { Customer } from "@/types/customer";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function CustomerEditForm({
  customer,
  isModal = false,
  onClose,
}: {
  customer: Customer;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCustomer, null);
  const [loading, setLoading] = useState(false);
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
      {loading && <OverlaySpinner />}
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
        {loading ? <OverlaySpinner /> : ""}

        {/* Modal Backdrop */}
        <div
          className="scrollbar-hidden fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="scrollbar-hidden relative max-h-[90vh] w-full max-w-sm overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            {...dragHandleProps}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            {/* Close button - DENTRO do card para não sumir */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-3 z-10 h-4 w-4 rounded-sm hover:text-red-500"
              onClick={handleCloseModal}
            >
              <IconX className="h-2 w-2" />
            </Button>

            {renderForm()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {loading ? <OverlaySpinner /> : ""}
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
