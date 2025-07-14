"use client";
import { updateInvoice } from "@/app/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { Invoice } from "@/types/invoice";
import { ProductWithRelations } from "@/types/ProductWithRelations";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { IconShoppingCart, IconX } from "@tabler/icons-react";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function InvoiceEditForm({
  invoice,
  products,
  isModal = false,
  onClose,
}: {
  invoice: Invoice;
  products: ProductWithRelations[];
  isModal?: boolean;
  onClose?: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateInvoice, null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [newInvoiceItems, setNewInvoiceItems] = useState<NewInvoiceItem[]>(
    invoice.InvoiceItem,
  );
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(invoice.pending.toString());
  const [date, setDate] = useState<Date | undefined>(
    invoice.purchaseDate ? new Date(invoice.purchaseDate) : undefined,
  );
  const [openDate, setOpenDate] = useState(false);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");

  const [stockMovement, setStockMovement] = useState<StockMovement[]>([]);
  const [openNewInvoiceItemProductList, setOpenNewInvoiceItemProductList] =
    useState(false);
  const [productAlreadyAdded, setProductAlreadyAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { position, dragHandleProps } = useDraggable();

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else if (isModal) {
      router.push("/invoices");
    }
  };

  const handleCloseDialog = () => {
    setProductId("");
    setUnitPrice("");
    setProductQuantity(1);
  };

  useEffect(() => {
    if (!productId) return;
    const getUnitPrice = invoice.InvoiceItem.find(
      (inv) => inv.Product.id === Number(productId),
    )?.unitPrice;
    setUnitPrice(getUnitPrice !== undefined ? getUnitPrice.toString() : "");
  }, [productId]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Venda atualizada com sucesso!");
      onClose?.();
    } else if (state?.message) {
      toast.error(state.message || "Erro ao atualizar venda");
    }
  }, [state]);

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
    <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
      <CardHeader {...dragHandleProps}>
        <CardTitle>Editar Venda</CardTitle>
        <CardDescription>Insira os dados e clique em Enviar</CardDescription>
        <CardAction>
          <Popover
            open={openNewInvoiceItemProductList}
            onOpenChange={setOpenNewInvoiceItemProductList}
          >
            <PopoverTrigger className="cursor-pointer">
              <div className="flex items-center gap-2">
                <IconShoppingCart /> Itens{" "}
                <Badge variant="outline">{newInvoiceItems.length}</Badge>
              </div>
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
                          <div className="grid grid-cols-[auto_auto_auto_auto] gap-2 truncate">
                            <Badge variant={"outline"}>{item.quantity}</Badge>
                            {
                              <Badge variant="outline">
                                {
                                  products.find(
                                    (prod) => prod.id === item.productId,
                                  )?.name
                                }
                              </Badge>
                            }

                            <Badge
                              variant={"outline"}
                            >{`${formatCurrencyBRL(item.unitPrice)}`}</Badge>

                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => {
                                handleDeleteNewInvoiceItemProduct(
                                  item.productId,
                                );
                              }}
                              className="h-fit w-auto cursor-pointer justify-self-center"
                            >
                              <IconX />
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
                            (acc, item) => acc + item.quantity * item.unitPrice,
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
        <Input type="hidden" name="id" value={invoice.id} />
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2"></div>
            <div className="grid gap-2">
              <Label htmlFor="customer">Cliente</Label>
              <Input type="text" disabled value={invoice.customer.name} />
              <input type="hidden" name="customer" value={invoice.customerId} />
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
                        <input type="hidden" name="product" value={productId} />
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
              <input type="hidden" name="date" value={date?.toISOString()} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-2">
          <Button type="submit" className="w-full cursor-pointer">
            Enviar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => handleCloseModal()}
          >
            Fechar a janela
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
            {/* Close button - DENTRO do card para não sumir */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-3 z-10 h-4 w-4 rounded-sm hover:text-red-500"
              onClick={handleCloseModal}
            >
              <IconX className="h-2 w-2" />
            </Button> */}

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
