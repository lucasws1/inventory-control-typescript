"use client";
import { updateStockMovement } from "@/app/lib/actions";
import OverlaySpinner from "@/components/overlaySpinner";
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
import { useDraggable } from "@/hooks/useDraggable";
import { IconX } from "@tabler/icons-react";
import extenso from "extenso";
import { ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function StockMovementEditPage({
  stockMovement,
  isModal = false,
  onClose,
}: {
  stockMovement: any;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateStockMovement,
    null,
  );
  const [loading, setLoading] = useState(false);
  const { position, dragHandleProps } = useDraggable();
  const router = useRouter();
  const [openDate, setOpenDate] = useState(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [stockReason, setStockReason] = useState(
    stockMovement.reason as string,
  );

  const stockReasons: string[] = [
    "COMPRA",
    "VENDA",
    "AJUSTE_POSITIVO",
    "AJUSTE_NEGATIVO",
    "OUTRO",
  ];

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/stock-movement");
    }
  };

  const renderForm = () => (
    <div>
      {loading && <OverlaySpinner />}

      <div className="flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Editar movimento de estoque</CardTitle>
            <CardDescription>
              {stockMovement?.reason.charAt(0).toUpperCase() +
                stockMovement.reason.slice(1).toLocaleLowerCase()}{" "}
              de {extenso(stockMovement.quantity, { number: { gender: "f" } })}{" "}
              {stockMovement.Product.name} em{" "}
              {stockMovement?.date.toLocaleDateString("pt-BR")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form action={formAction}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input type="hidden" name="id" value={stockMovement?.id} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Razão</Label>
                  <Select value={stockReason} onValueChange={setStockReason}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Movimentações</SelectLabel>
                        {stockReasons.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="reason" value={stockReason} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={stockMovement?.quantity as number}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date" className="px-1">
                    Data
                  </Label>
                  <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        {dateValue
                          ? dateValue.toLocaleDateString("pt-BR")
                          : "Selecione uma data"}
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
                          setDateValue(date);
                          setOpenDate(false);
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
                {/* </div> */}
                <div className="relative flex flex-col gap-2">
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
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
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
              className="absolute top-1 right-2 z-10 h-4 w-4 rounded-sm hover:text-red-500"
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
