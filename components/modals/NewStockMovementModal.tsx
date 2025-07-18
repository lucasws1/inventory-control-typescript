"use client";
import { StockReason } from "@/app/generated/prisma";
import { createStockMovement } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { useDraggable } from "@/hooks/useDraggable";
import { ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export default function NewStockMovementModal({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    createStockMovement,
    null,
  );
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { position, dragHandleProps } = useDraggable();
  const { products, refreshData } = useData();
  // Fechar modal quando a operação for bem-sucedida
  useEffect(() => {
    if (state?.success && isModal) {
      onClose?.();
      toast.success(
        state.message || "Movimentação de estoque criada com sucesso!",
      );
    } else if (state?.error) {
      toast.error(state.message || "Erro ao criar movimentação de estoque");
    }
  }, [state, isModal, onClose]);

  useEffect(() => {
    (async () => state?.success && (await refreshData()))();
  }, [state, refreshData]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderForm = () => (
    <>
      <Card
        className="mx-auto w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader {...dragHandleProps}>
          <CardTitle>Movimentação de estoque</CardTitle>
          <CardDescription>
            Insira os dados abaixo para fazer uma nova movimentação de estoque.
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
                <Label htmlFor="name">Produto</Label>
                <Select name="product">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Products</SelectLabel>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  defaultValue={1}
                  placeholder="0"
                  name="quantity"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Tipo</Label>
                <Select defaultValue="COMPRA" name="reason">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo de movimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tipo</SelectLabel>
                      {Object.values(StockReason).map(
                        (reason) =>
                          reason !== "VENDA" && (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="px-1">
                  Data
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="dateValue"
                      className="w-full justify-between font-normal"
                    >
                      {dateValue.toLocaleDateString("pt-BR")}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="scrollbar-hidden w-auto overflow-hidden p-0"
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
                          setIsCalendarOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  id="dateValue"
                  type="hidden"
                  name="dateValue"
                  value={dateValue.toISOString()}
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
                  onClick={handleCloseModal}
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Fechar a janela
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
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
