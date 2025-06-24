import prisma from "@/lib/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCustomer } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PageProps = {
  id: string;
};

export const metadata: Metadata = {
  title: "Editar Cliente",
};

export default async function NewInvoice({ params }: { params: PageProps }) {
  return (
    <div className="mx-2 flex justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Nova Venda</CardTitle>
          <CardDescription>Em 20/06/2025</CardDescription>
          <CardAction>
            <Button variant={"link"}>Ver faturas</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                {/* <Input type="hidden" name="id" placeholder="nome" /> */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Cliente</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clientes</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Produto</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teste@gmail.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Preço unitário</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="51999965748"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="">Adicionar produto</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="">Status</Label>
                <Input />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="">Data</Label>
                <Input />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Enviar
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/customers">Retornar para Clientes</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
