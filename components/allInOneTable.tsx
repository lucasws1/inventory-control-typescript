"use client";

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
import { Button } from "./ui/button";

const AllInOneTable = ({ tableData }: { tableData: TableData[] }) => {
  const pathname = usePathname();

  const columns: TableColumns = columnsConfig[pathname];

  return (
    <Table>
      <TableCaption>Lista de Clientes</TableCaption>
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
                <PopoverTrigger asChild>
                  <Link
                    className="inline-flex items-center gap-2 font-medium"
                    href="#"
                  >
                    {item.col1}
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </Link>
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
                          : `/products/${item.id}`
                      }
                    >
                      Editar
                    </Link>
                  </Button>
                  <Button
                    className="w-full cursor-pointer justify-start"
                    variant="ghost"
                    size="sm"
                  >
                    Remover
                  </Button>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>
              {pathname === "/customers" || pathname === "/products"
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
            {typeof tableData[0].col4 === "number"
              ? tableData.reduce((sum, c) => sum + Number(c.col4), 0)
              : "0"}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default AllInOneTable;
