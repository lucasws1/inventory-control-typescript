"use client";
import { updateProduct } from "@/app/lib/actions";
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
import { useActionState, useState } from "react";

export default function ProductEditForm({
  product,
}: {
  product: { id: number; name: string; price: number } | null;
}) {
  const [state, formAction, pending] = useActionState(updateProduct, null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading ? <OverlaySpinner /> : ""}
      <form action={formAction}>
        <div className="mx-2 flex justify-center">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Alterar dados de {product?.name}</CardTitle>
              <CardDescription>Produto id n. {product?.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Input type="hidden" name="id" value={product?.id} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={product?.name as string}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Preço</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    defaultValue={product?.price as number}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={() => setLoading(true)}
              >
                Salvar Alterações
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => setLoading(true)}
              >
                Retornar para produtos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
