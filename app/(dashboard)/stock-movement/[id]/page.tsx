"use client";
import { updateStockMovement } from "@/app/lib/actions";
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
import { ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";

export default function StockMovementEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { stockMovements, products, refreshData } = useData();
  const stockMovement = stockMovements.find(
    (stockMovement) => stockMovement.id === Number(id),
  );
  const [state, formAction, pending] = useActionState(
    updateStockMovement,
    null,
  );
  const router = useRouter();
  const [openDate, setOpenDate] = useState(false);
  const [dateValue, setDateValue] = useState<Date>(
    stockMovement?.date ? new Date(stockMovement.date) : new Date(),
  );
  const [stockReason, setStockReason] = useState(
    stockMovement?.reason as string,
  );

  const stockReasons: string[] = [
    "COMPRA",
    "VENDA",
    "AJUSTE_POSITIVO",
    "AJUSTE_NEGATIVO",
    "OUTRO",
  ];

  useEffect(() => {
    if (state?.success) {
      const refresh = async () => await refreshData();
      router.push("/stock-movement");
      refresh();
    }
  }, [state]);

  const renderForm = () => (
    <div>
      <div className="flex justify-center">
        <Card className="w-full min-w-sm" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <CardTitle>Editar movimento de estoque</CardTitle>
            <CardDescription>
              Para alterar a movimentação de estoque, preencha os campos abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="productName">Produto</Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                defaultValue={
                  products.find(
                    (product) => product.id === stockMovement?.Product.id,
                  )?.name
                }
                disabled
              />
            </div>
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
                          if (date) {
                            setDateValue(date);
                            setOpenDate(false);
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
                  <Button type="submit" className="w-full cursor-pointer">
                    Enviar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/stock-movement")}
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

  return (
    <>
      <div className="absolute inset-0 z-50 flex h-full w-full min-w-md items-center justify-center bg-black/90">
        {renderForm()}
      </div>
    </>
  );
}
