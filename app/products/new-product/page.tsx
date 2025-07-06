"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { createProduct } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { useDraggable } from "@/hooks/useDraggable";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function NewProduct() {
  const isModal = false;
  const onClose = () => {};
  const [state, formAction, pending] = useActionState(createProduct, null);
  const [dateValue, setDateValue] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const { position, dragHandleProps } = useDraggable();
  const router = useRouter();

  // Fechar modal quando a operação for bem-sucedida
  useEffect(() => {
    if (state?.success && isModal) {
      toast.success("Produto criado com sucesso!");
      onClose?.();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, isModal, onClose]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/products");
    }
  };

  const renderForm = () => (
    <div>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cadastrar novo produto</CardTitle>
          <CardDescription>Insira os dados abaixo</CardDescription>
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
                <Input id="name" type="text" placeholder="Nome" name="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Valor (custo)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Preço"
                  name="price"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Quantidade"
                  name="quantity"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Data
                </Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="dateValue"
                      className="w-full justify-between font-normal"
                    >
                      {new Date().toLocaleDateString("pt-BR")}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      required={true}
                      selected={dateValue}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          setDateValue(date);
                          setOpenDate(false);
                        }
                      }}
                    />
                    <input
                      id="dateValue"
                      type="hidden"
                      name="dateValue"
                      value={dateValue.toISOString()}
                    />
                  </PopoverContent>
                </Popover>
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
                  onClick={() => handleCloseModal()}
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Fechar janela
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
