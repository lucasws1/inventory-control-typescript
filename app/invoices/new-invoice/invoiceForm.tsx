"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/types/customer";
import { Product } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";

import { handleInvoiceSubmit } from "@/app/lib/actions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";

export type InvoiceItem = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

const InvoiceForm = ({
  customers,
  products,
  invoiceItems,
}: {
  customers: Customer[];
  products: Product[];
  invoiceItems: InvoiceItem[];
}) => {
  const [customerId, setCustomerId] = useState("1");
  const [productQuantity, setProductQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [newInvoiceItems, setNewInvoiceItems] = useState<InvoiceItem[]>([]);
  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState("true");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");
  type StockMovement = {
    productId: number;
    quantity: number;
    date: Date | undefined;
    reason: string;
  };
  const [stockMovement, setStockMovement] = useState<StockMovement[]>([]);
  const [openNewInvoiceItemProductList, setOpenNewInvoiceItemProductList] =
    useState(false);
  const [productAlreadyAdded, setProductAlreadyAdded] = useState(false);

  const handleCloseDialog = () => {
    setProductId("");
    setUnitPrice("");
    setProductQuantity(1);
  };

  useEffect(() => {
    if (!productId) return;
    const up = invoiceItems.find(
      (inv) => inv.productId === Number(productId),
    )?.unitPrice;
    setUnitPrice(up !== undefined ? up.toString() : "");
  }, [productId]);

  const handleAddProduct = () => {
    if (!productId || !productQuantity || !unitPrice) return;
    if (newInvoiceItems.find((item) => item.productId === Number(productId))) {
      setProductQuantity(1);

      setOpen(false);

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

  const newInvoiceSubmit = async () => {
    const newInvoice = {
      amount: newInvoiceItems.reduce(
        (sum, invItem) => sum + invItem.quantity * invItem.unitPrice,
        0,
      ),
      pending: pendingValue === "true",
      purchaseDate: date,
      customerId: Number(customerId),
      newInvoiceItems,
      stockMovement,
    };
    const response = await handleInvoiceSubmit(newInvoice);
    if (response.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  const handleDeleteNewInvoiceItemProduct = (
    newInvoiceItemProductId: number,
  ) => {
    setNewInvoiceItems((items) =>
      items.filter((item) => item.productId !== newInvoiceItemProductId),
    );

    setOpenNewInvoiceItemProductList(false);
  };

  return (
    <div className="mx-2 flex justify-center font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Nova venda</CardTitle>
          <CardDescription>Insira os dados e clique em Enviar</CardDescription>
          <CardAction>
            <Popover
              open={openNewInvoiceItemProductList}
              onOpenChange={setOpenNewInvoiceItemProductList}
            >
              <PopoverTrigger className="cursor-pointer">
                Itens ({newInvoiceItems.length})
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                {newInvoiceItems.length === 0 ? (
                  "Nenhum item adicionado"
                ) : (
                  <div>
                    <div>
                      {newInvoiceItems.map((item) => (
                        <div key={item.productId}>
                          <div className="grid w-auto grid-cols-[auto_auto_auto_1fr] gap-2 truncate">
                            <div className="w-24 text-start font-bold">
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
                        </div>
                      ))}
                      <div className="grid grid-cols-4">
                        <span className="col-span-2 text-start">Total: </span>
                        <span className="col-span-2 text-end">
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
        <form action={newInvoiceSubmit}>
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
                {/* <input type="hidden" name="customer" value={customerId} /> */}
              </div>
              <div>
                <div className="flex flex-col gap-2">
                  <Label>Produto</Label>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setProductAlreadyAdded(false)}
                        variant="outline"
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
                          <Button onClick={handleCloseDialog} variant="outline">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button type="button" onClick={handleAddProduct}>
                          Adicionar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      className="w-full justify-between font-normal"
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
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-2">
            <Button type="submit" className="w-full">
              Enviar
            </Button>
            <div className="grid w-full max-w-xl items-start gap-4">
              {status === "success" && (
                <Alert>
                  <CheckCircle2Icon />
                  <AlertTitle>Successo!</AlertTitle>
                  <AlertDescription>
                    A venda foi lançada com sucesso. Clique abaixo para
                    retornar.
                  </AlertDescription>
                </Alert>
              )}
              {status === "error" && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Erro.</AlertTitle>
                  <AlertDescription>
                    <p>
                      Houve um erro na hora de lançar a venda. Tente novamente
                      mais tarde.
                    </p>
                    <ul className="list-inside list-disc text-sm">
                      <li>Check your card details</li>
                      <li>Ensure sufficient funds</li>
                      <li>Verify billing address</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Button variant="outline" className="w-full">
              <Link href="/invoices">Retornar para Vendas</Link>
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
        </form>
      </Card>
    </div>
  );
};

export default InvoiceForm;
