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
import { useActionState } from "react";
import OverlaySpinner from "@/components/overlaySpinner";
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

export default function NewProduct() {
  const [state, formAction, pending] = useActionState(createProduct, null);
  const [dateValue, setDateValue] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReturn = () => {
    setLoading(true);
    router.push("/products");
  };

  return (
    <>
      {loading ? <OverlaySpinner /> : ""}
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cadastrar novo produto</CardTitle>
          <CardDescription>Insira os dados abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={formAction}>
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
                        setDateValue(date);
                        setOpenDate(false);
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
                <Button type="submit" className="w-full cursor-pointer">
                  Cadastrar
                </Button>

                <Button
                  onClick={handleReturn}
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  Retornar à lista de produtos
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
