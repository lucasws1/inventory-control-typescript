"use client";

import { updateProduct } from "@/app/lib/actions";
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
import { useActionState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { use } from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [state, formAction, pending] = useActionState(updateProduct, null);
  const { products, refreshData } = useData();
  const router = useRouter();
  const product = products.find((product) => product.id === Number(id)) || null;

  useEffect(() => {
    if (state?.success) {
      const refresh = async () => await refreshData();
      router.push("/products");
      refresh();
    }
  }, [state]);

  const createdAt = product?.createdAt
    ? new Date(product.createdAt).toLocaleDateString("pt-BR")
    : "Data não disponível";

  const updatedAt = product?.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString("pt-BR")
    : "Data não disponível";

  const renderForm = () => (
    <div>
      <Form action={formAction}>
        <div className="mx-auto flex justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Editar produto</CardTitle>
              <CardDescription>
                Insira os novos dados abaixo para editar o produto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      defaultValue={product?.name as string}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="id">ID</Label>
                    <Input
                      id="id"
                      name="id"
                      type="number"
                      className="w-16"
                      disabled
                      defaultValue={product?.id}
                    />
                    <input type="hidden" name="id" value={product?.id} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex w-full flex-col gap-2">
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={product?.price}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="invoiceItems">Vendas</Label>
                    <Input
                      className="w-16"
                      id="invoiceItems"
                      name="invoiceItems"
                      type="number"
                      disabled
                      defaultValue={product?.InvoiceItem.length || 0}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="createdAt">Cadastro</Label>
                  <Input
                    id="createdAt"
                    name="createdAt"
                    type="text"
                    defaultValue={createdAt}
                    disabled
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="updatedAt">Última edição</Label>
                  <Input
                    id="updatedAt"
                    name="updatedAt"
                    type="text"
                    disabled
                    defaultValue={updatedAt}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => router.push("/products")}
              >
                Fechar janela
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Form>
    </div>
  );

  return (
    <>
      <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-black/90">
        {renderForm()}
      </div>
    </>
  );
}
