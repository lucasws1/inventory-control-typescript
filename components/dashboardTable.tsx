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

export default function DashboardTable() {
  return (
    <Table>
      <TableCaption>Últimas vendas</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">12/06</TableCell>
          <TableCell>Verônica</TableCell>
          <TableCell>10 LP 2 can</TableCell>
          <TableCell className="text-right">R$ 3.200,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">20/06</TableCell>
          <TableCell>Beto</TableCell>
          <TableCell>3 LP 1 bol</TableCell>
          <TableCell className="text-right">R$ 6.200,00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-medium">Total</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">R$ 9.400,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
