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
import { useData } from "@/contexts/DataContext";
import { useDraggable } from "@/hooks/useDraggable";
import { ProductWithRelations } from "@/types/ProductWithRelations";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function ProductEditForm({
  product,
  isModal = false,
  onClose,
}: {
  product?: ProductWithRelations | null;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateProduct, null);
  const { position, dragHandleProps } = useDraggable();
  const { refreshData } = useData();

  if (!product) {
    return;
  }

  useEffect(() => {
    if (state?.success) {
      const refresh = async () => await refreshData();
      handleCloseModal();
      refresh();
      toast.success(state.message || "Produto atualizado com sucesso!");
    } else if (state?.error) {
      toast.error(state.error || "Erro ao atualizar produto");
    }
  }, [state]);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderForm = () => (
    <div>
      <Form action={formAction}>
        <div className="mx-auto flex justify-center">
          <Card
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader {...dragHandleProps}>
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
                      defaultValue={product?.price as number}
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
                    disabled
                    defaultValue={
                      product?.createdAt
                        ? new Date(product.createdAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Data não disponível"
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="updatedAt">Última edição</Label>
                  <Input
                    id="updatedAt"
                    name="updatedAt"
                    type="text"
                    disabled
                    defaultValue={
                      product?.updatedAt
                        ? new Date(product.updatedAt).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Data não disponível"
                    }
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Salvar Alterações
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleCloseModal}
              >
                Fechar janela
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Form>
    </div>
  );
  // Retorna o formulário em modal ou modo normal
  if (isModal) {
    return (
      <>
        {/* Modal Backdrop */}
        <div
          className="scrollbar-hidden fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="scrollbar-hidden relative max-h-[90vh] w-full max-w-sm overflow-y-auto"
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          >
            {renderForm()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-2 flex justify-center font-sans">{renderForm()}</div>
    </>
  );
}
