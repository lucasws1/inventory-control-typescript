"use client";
import { createCustomer } from "@/app/lib/actions";
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
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDraggable } from "@/hooks/useDraggable";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function NewCustomerModal({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(createCustomer, null);
  const { position, dragHandleProps } = useDraggable();
  const router = useRouter();

  // Fechar modal quando a operação for bem-sucedida
  useEffect(() => {
    console.log("State after action:", state);

    if (state?.success && isModal) {
      toast.success("Cliente criado com sucesso!");
      console.log("Cliente criado com sucesso!", state);
      onClose?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isModal, onClose]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/customers");
    }
  };

  const renderForm = () => (
    <div>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cadastrar novo cliente</CardTitle>
          <CardDescription>
            Insira os dados abaixo para fazer um novo cadastro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction}>
            <input
              type="hidden"
              name="isModal"
              value={isModal ? "true" : "false"}
            />
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Insira o nome"
                  name="name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Insira o email"
                  name="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Insira o número do telefone"
                  name="phone"
                />
              </div>
              <div className="relative flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full cursor-pointer"
                >
                  {pending ? "Cadastrando..." : "Cadastrar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleCloseModal}
                >
                  {isModal ? "Fechar janela" : "Retornar à lista de clientes"}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const modalContent = (
    <>
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
          {renderForm()}
        </div>
      </div>
    </>
  );

  if (isModal) {
    if (typeof document !== "undefined") {
      return createPortal(modalContent, document.body);
    }
    return null;
  }

  return (
    <>
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
