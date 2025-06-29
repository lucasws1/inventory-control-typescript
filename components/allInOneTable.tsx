"use client";

import {
  deleteCustomer,
  deleteInvoice,
  deleteProduct,
  deleteStockMovement,
} from "@/app/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableData } from "@/types/tableData";
import { columnsConfig, TableColumns } from "@/utils/columnsConfig";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const AllInOneTable = ({ tableData }: { tableData: TableData[] }) => {
  const [openRemoveAlert, setOpenRemoveAlert] = useState(false);
  const [loadingRemoveAlert, setLoadingRemoveAlert] = useState(false);
  const pathname = usePathname();

  const handleDelete = async (item: any) => {
    setLoadingRemoveAlert(true);
    if (pathname === "/invoices") {
      const res = await deleteInvoice(item);
      if (res.success) {
        console.log("Sucesso ao deletar a fatura.");
      } else {
        console.log("Falha ao deletar a fatura.");
      }
    } else if (pathname === "/customers") {
      await deleteCustomer(item);
    } else if (pathname === "/products") {
      await deleteProduct(item);
    } else if (pathname === "/stock-movement") {
      await deleteStockMovement(item);
    }
    setLoadingRemoveAlert(false);
    setOpenRemoveAlert(false);
  };

  const columns: TableColumns = columnsConfig[pathname];
  // shadow-[0_4px_24px_0_rgba(0,0,0,0.30)]
  return (
    <div>
      <div className="bg-card rounded-md border p-4">
        <Table>
          {/* <TableCaption>Tabela de {pathname}</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="text-zinc-400">{columns.col1}</TableHead>
              <TableHead className="text-zinc-400">{columns.col2}</TableHead>
              <TableHead className="text-zinc-400">{columns.col3}</TableHead>
              <TableHead className="text-right text-zinc-400">
                {columns.col4}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Popover>
                    <PopoverTrigger className="inline-flex cursor-pointer items-center gap-2 font-medium">
                      {item.col1}
                      <ChevronDown className="text-muted-foreground h-4 w-4" />
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="start"
                      className="flex w-full flex-col p-0"
                    >
                      <Button className="w-full" asChild variant="ghost">
                        <Link
                          href={
                            pathname === "/customers"
                              ? `/customers/${item.id}`
                              : pathname === "/products"
                                ? `/products/${item.id}`
                                : pathname === "/stock-movement"
                                  ? `/stock-movement/${item.id}` // ainda não implementado
                                  : `/invoices/${item.id}`
                          }
                        >
                          Editar
                        </Link>
                      </Button>

                      <AlertDialog
                      // open={openRemoveAlert}
                      // onOpenChange={setOpenRemoveAlert}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            className="w-full cursor-pointer justify-start"
                            variant="ghost"
                          >
                            Remover
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remover{" "}
                              {pathname === "/invoices"
                                ? "esta venda"
                                : pathname === "/customers"
                                  ? "este cliente"
                                  : "este produto"}
                              ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Este item será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="cursor-pointer"
                              disabled={loadingRemoveAlert}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="cursor-pointer"
                              onClick={() => handleDelete(item.id)}
                              disabled={loadingRemoveAlert}
                            >
                              {loadingRemoveAlert
                                ? "Deletando..."
                                : "Confirmar"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  {pathname === "/products"
                    ? formatCurrencyBRL(item.col2 as number)
                    : item.col2}
                </TableCell>
                <TableCell>
                  {pathname === "/customers"
                    ? formatCurrencyBRL(item.col3 as number)
                    : item.col3}
                </TableCell>
                <TableCell className="text-right">
                  {pathname === "/customers" ||
                  pathname === "/invoices" ||
                  pathname === "/products"
                    ? formatCurrencyBRL(item.col4 as number)
                    : item.col4}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-medium">Total</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                {typeof tableData[0].col4 === "undefined"
                  ? "0"
                  : typeof tableData[0].col4 === "number" &&
                      pathname === "/invoices"
                    ? formatCurrencyBRL(
                        tableData.reduce((sum, c) => sum + Number(c.col4), 0),
                      )
                    : "0"}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default AllInOneTable;
