"use client";
import { createInvoice } from "@/app/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { useDraggable } from "@/hooks/useDraggable";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { IconShoppingCart } from "@tabler/icons-react";
import { useData } from "@/contexts/DataContext";

type NewInvoiceItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

type StockMovement = {
  productId: number;
  quantity: number;
  date: Date | undefined;
  reason: string;
};

type ModalResult = any;

export default function NewInvoiceModal({
  isModal = false,
  onClose,
}: {
  isModal?: boolean;
  onClose?: (result?: ModalResult) => void;
}) {
  const [state, formAction, pending] = useActionState(createInvoice, null);
  const [customerId, setCustomerId] = useState("1");
  const [productQuantity, setProductQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [newInvoiceItems, setNewInvoiceItems] = useState<NewInvoiceItem[]>([]);
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState("true");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  const [stockMovement, setStockMovement] = useState<StockMovement[]>([]);
  const [openNewInvoiceItemProductList, setOpenNewInvoiceItemProductList] =
    useState(false);
  const [productAlreadyAdded, setProductAlreadyAdded] = useState(false);
  const { position, dragHandleProps } = useDraggable();
  const { products, customers, invoiceItems, refreshData } = useData();
  // Fechar modal quando a operação for bem-sucedida
  useEffect(() => {
    if (state?.success && isModal) {
      onClose?.({ success: true, data: state });
      toast.success(state.message || "Venda lançada com sucesso!");
    } else if (state?.error) {
      toast.error(state.message || "Erro ao lançar venda");
    }
  }, [state, isModal, onClose]);

  useEffect(() => {
    (async () => state?.success && (await refreshData()))();
  }, [state, refreshData]);

  const handleCloseDialog = () => {
    setProductId("");
    setUnitPrice("");
    setProductQuantity(1);
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose({ success: false, cancelled: true });
    }
  };

  useEffect(() => {
    if (!productId) return;
    const up = invoiceItems.find(
      (inv) => inv.productId === Number(productId),
    )?.unitPrice;
    setUnitPrice(up !== undefined ? up.toString() : "");
  }, [productId, invoiceItems]);

  const handleAddProduct = () => {
    if (!productId || !productQuantity || !unitPrice) return;
    if (newInvoiceItems.find((item) => item.productId === Number(productId))) {
      setProductQuantity(1);
      setOpen(false);
      setUnitPrice("");
      setProductAlreadyAdded(true);
      return;
    }

    setNewInvoiceItems((items) => [
      ...items,
      {
        productId: Number(productId),
        quantity: productQuantity,
        unitPrice: Number(unitPrice),
      },
    ]);
    setStockMovement((items) => [
      ...items,
      {
        productId: Number(productId),
        quantity: productQuantity,
        date,
        reason: "VENDA",
      },
    ]);
    setOpen(false);
    setProductQuantity(1);
    setUnitPrice("");
  };

  const handleDeleteNewInvoiceItemProduct = (
    newInvoiceItemProductId: number,
  ) => {
    setNewInvoiceItems((items) =>
      items.filter((item) => item.productId !== newInvoiceItemProductId),
    );

    setOpenNewInvoiceItemProductList(false);
  };

  const renderForm = () => (
    <>
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardHeader {...dragHandleProps}>
          <CardTitle>Nova venda</CardTitle>
          <CardDescription>
            Insira os dados abaixo para fazer uma nova venda.
          </CardDescription>
          <CardAction>
            <Popover
              open={openNewInvoiceItemProductList}
              onOpenChange={setOpenNewInvoiceItemProductList}
            >
              <PopoverTrigger className="flex cursor-pointer items-center gap-2">
                <IconShoppingCart className="size-4" /> (
                {newInvoiceItems.length})
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                {newInvoiceItems.length === 0 ? (
                  "Nenhum item adicionado"
                ) : (
                  <div>
                    <div>
                      {newInvoiceItems.map((item) => (
                        <div key={item.productId}>
                          <div className="grid w-auto grid-cols-[auto_auto_auto_auto] gap-2 truncate">
                            <div className="w-28 truncate text-start font-bold">
                              {
                                products.find((p) => p.id === item.productId)
                                  ?.name
                              }
                            </div>
                            <div className="w-12 text-start">
                              {item.quantity}
                            </div>
                            <div className="w-28 text-start">{`${formatCurrencyBRL(item.unitPrice)}`}</div>

                            <div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  handleDeleteNewInvoiceItemProduct(
                                    item.productId,
                                  );
                                }}
                                className="h-fit w-auto cursor-pointer justify-self-center"
                              >
                                Deletar
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-3" />
                        </div>
                      ))}
                      <div className="grid grid-cols-4">
                        <span className="col-span-1 justify-self-start">
                          Total:
                        </span>
                        <span className="col-span-3 justify-self-end">
                          {formatCurrencyBRL(
                            newInvoiceItems.reduce(
                              (acc, item) =>
                                acc + item.quantity * item.unitPrice,
                              0,
                            ),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </CardAction>
        </CardHeader>
        <Form action={formAction}>
          <input
            type="hidden"
            name="isModal"
            value={isModal ? "true" : "false"}
          />
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2"></div>
              <div className="grid gap-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select onValueChange={setCustomerId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clientes</SelectLabel>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" name="customer" value={customerId} />
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <Label>Produto</Label>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setProductAlreadyAdded(false)}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        Adicionar produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Dados do item</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do item vendido
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="product">Produto</Label>
                          <Select onValueChange={setProductId}>
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
                          <input
                            type="hidden"
                            name="product"
                            value={productId}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="quantidade">Quantidade</Label>
                          <Input
                            id="productQuantity"
                            name="productQuantity"
                            onChange={(e) =>
                              setProductQuantity(Number(e.target.value))
                            }
                            value={productQuantity}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="unitPrice">Preço unitário</Label>
                          <Input
                            onChange={(e) => setUnitPrice(e.target.value)}
                            placeholder="360,00"
                            id="unitPrice"
                            name="unitPrice"
                            value={unitPrice}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            onClick={handleCloseDialog}
                            variant="outline"
                            className="cursor-pointer"
                          >
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button
                          className="cursor-pointer"
                          type="button"
                          onClick={handleAddProduct}
                        >
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <input
                    type="hidden"
                    name="invoiceItems"
                    value={JSON.stringify(newInvoiceItems)}
                  />
                  <input
                    type="hidden"
                    name="stockMovement"
                    value={JSON.stringify(stockMovement)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="">Pendente</Label>
                <Select value={pendingValue} onValueChange={setPendingValue}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pendente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="true">Pendente</SelectItem>
                      <SelectItem value="false">Pago</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <input type="hidden" name="pending" value={pendingValue} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  Data
                </Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full cursor-pointer justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString("pt-BR") : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          setDate(date);
                          setOpenDate(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <input
                  id="date"
                  type="hidden"
                  name="date"
                  value={date?.toISOString()}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-2">
            <Button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer"
            >
              {pending ? "Enviando..." : "Enviar"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={handleCloseModal}
            >
              {isModal ? "Fechar janela" : "Retornar para Vendas"}
            </Button>
            {productAlreadyAdded && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle className="align-center">
                  Esse item já foi selecionado
                </AlertTitle>
                <AlertDescription>
                  <p>Suas alternativas são:</p>
                  <ul className="list-inside list-disc text-sm">
                    <li>Alterar a quantidade do item</li>
                    <li>Selecionar outro item</li>
                    <li>Lançar a venda no banco de dados</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </Form>
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
          className="scrollbar-hidden relative max-h-[90vh] w-full max-w-lg overflow-y-auto"
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
