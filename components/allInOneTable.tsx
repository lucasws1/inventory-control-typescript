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
import { SummaryCustomer } from "@/types/summaryCustomer";
import { columnsConfig, TableColumns } from "@/utils/columnsConfig";
import { formatCurrencyBRL } from "@/utils/formatCurrencyBRL";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function AllInOneTable({
  customers,
}: {
  customers: SummaryCustomer[];
}) {
  const pathname = usePathname();

  const columns: TableColumns = columnsConfig[pathname];

  return (
    <Table>
      <TableCaption>Lista de Clientes</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{columns.col1}</TableHead>
          <TableHead>{columns.col2}</TableHead>
          <TableHead>{columns.col3}</TableHead>
          <TableHead className="text-right">{columns.col4}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              <Popover>
                <PopoverTrigger asChild>
                  <Link
                    className="inline-flex items-center gap-2 font-medium"
                    href="#"
                  >
                    {customer.name}
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </Link>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="start"
                  className="flex w-full flex-col p-1"
                >
                  <Button className="w-full" asChild variant="link">
                    <Link href={`/customers/${customer.id}`}>Editar</Link>
                  </Button>
                  <Button
                    className="w-full cursor-pointer justify-start"
                    variant="destructive"
                    size="sm"
                  >
                    Remover
                  </Button>
                </PopoverContent>
              </Popover>
            </TableCell>
            <TableCell>{customer.monthlyInvoiceCount}</TableCell>
            <TableCell>{formatCurrencyBRL(customer.pendingAmount)}</TableCell>
            <TableCell className="text-right">
              {formatCurrencyBRL(customer.monthAmount)}
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
            {customers.reduce((sum, c) => sum + c.monthAmount, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
