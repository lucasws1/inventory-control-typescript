"use client";
import { updateStockMovement } from "@/app/lib/actions";
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
import { StockMovement } from "@/types/stockMovement";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import extenso from "extenso";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Form from "next/form";

export default function StockMovementEditForm({
  stockMovement,
}: {
  stockMovement: StockMovement;
}) {
  const [state, formAction, pending] = useActionState(
    updateStockMovement,
    null,
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openDate, setOpenDate] = useState(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [stockReason, setStockReason] = useState(
    stockMovement.reason as string,
  );
  console.log(dateValue);

  const stockReasons: string[] = [
    "COMPRA",
    "VENDA",
    "AJUSTE_POSITIVO",
    "AJUSTE_NEGATIVO",
    "OUTRO",
  ];

  const handleReturn = () => {
    setLoading(true);
    router.push("/stock-movement");
  };
  return (
    <div>
      {loading && <OverlaySpinner />}

      <div className="mx-2 flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              {stockMovement?.reason.charAt(0).toUpperCase() +
                stockMovement.reason.slice(1).toLocaleLowerCase()}{" "}
              de {extenso(stockMovement.quantity, { number: { gender: "f" } })}{" "}
              {stockMovement.Product.name}
            </CardTitle>
            <CardDescription>
              Em {stockMovement?.date.toLocaleDateString("pt-BR")}
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
                      className="w-auto overflow-hidden p-0"
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
                    onClick={handleReturn}
                  >
                    Enviar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={handleReturn}
                  >
                    Retornar para estoque
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
