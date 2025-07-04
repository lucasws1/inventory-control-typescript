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
import { IconX } from "@tabler/icons-react";
import { useDraggable } from "@/hooks/useDraggable";
import { createPortal } from "react-dom";

export default function NewCustomer({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(createCustomer, null);
  const [loading, setLoading] = useState(false);
  const { position, dragHandleProps } = useDraggable();
  const router = useRouter();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/customers");
    }
  };

  const handleReturn = () => {
    if (isModal) {
      handleCloseModal();
    } else {
      setLoading(true);
      router.push("/customers");
    }
  };

  const renderForm = () => (
    <div>
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
                <Button
                  type="submit"
                  onClick={() => handleCloseModal()}
                  className="w-full cursor-pointer"
                >
                  Cadastrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={handleReturn}
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
          {/* Close button */}
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

  if (isModal) {
    if (typeof document !== "undefined") {
      return createPortal(modalContent, document.body);
    }
    return null;
  }

  return (
    <>
      {loading ? <OverlaySpinner /> : ""}
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
