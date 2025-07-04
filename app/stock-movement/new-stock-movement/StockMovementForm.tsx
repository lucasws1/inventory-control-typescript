"use client";
import { StockReason } from "@/app/generated/prisma";
import { createStockMovement } from "@/app/lib/actions";
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
import { Product } from "@/types/product";
import { StockMovement } from "@/types/stockMovement";
import { ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function StockMovementForm({
  products,
}: {
  products: { id: number; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    createStockMovement,
    null,
  );
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = () => {
    setLoading(true);
    router.push("/stock-movement");
  };

  return (
    <>
      {loading ? <OverlaySpinner /> : ""}
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Movimentar estoque</CardTitle>
          <CardDescription>Insira os dados abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction}>
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
                      {Object.values(StockReason).map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
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
                        setDateValue(date);
                        setIsCalendarOpen(false);
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
                  Cadastrar
                </Button>
                <Button
                  onClick={handleReturn}
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Retornar ao estoque
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
