"use client";

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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useState } from "react";

import {
  deleteManyCustomers,
  deleteManyInvoices,
  deleteManyProducts,
  deleteManyStockMovements,
} from "@/app/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/contexts/DataContext";
import { useChartData } from "@/contexts/ChartDataContext";
import { useModal } from "@/contexts/ModalContext";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconLayoutColumns,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

// Mapeamento de traduções para os nomes das colunas
const columnTranslations: Record<string, string> = {
  select: "Seleção",
  date: "Data",
  product: "Produto",
  products: "Produtos",
  quantity: "Quantidade",
  reason: "Motivo",
  actions: "Ações",
  amount: "Valor",
  customer: "Cliente",
  customers: "Clientes",
  email: "Email",
  purchaseDate: "Data",
  createdAt: "Criado em",
  updatedAt: "Atualizado em",
  stock: "Estoque",
  stockMovements: "Movimentações de Estoque",
  invoice: "Venda",
  invoices: "Vendas",
  "stock-movement": "Movimentações de Estoque",
  pending: "Status",
  name: "Nome",
  customer_name: "Cliente",
  price: "Preço",
  totalAmount: "Total",
};

// Ensure table rows carry a unique identifier
type RowWithId = { id: number };

interface DataTableProps<TData extends RowWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends RowWithId, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const pathname = usePathname();
  const { refreshData } = useData();

  // Adicionar useChartData para sincronizar dados do gráfico
  let getChartData: any;
  try {
    const chartContext = useChartData();
    getChartData = chartContext.getChartData;
  } catch (error) {
    console.warn("Chart context not available:", error);
    getChartData = () => Promise.resolve();
  }

  // Adicionar verificação de segurança para o useModal
  let openModal: any;
  try {
    const modalContext = useModal();
    openModal = modalContext.openModal;
  } catch (error) {
    console.warn("Modal context not available:", error);
    openModal = () => {};
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  const handleNew = async (pathname: string) => {
    try {
      const modalType =
        pathname.slice(-1) === "s"
          ? "new-" + pathname.split("/")[1].slice(0, -1)
          : "new-" + pathname.split("/")[1];
      const result = await openModal(modalType);
      if (result?.success) {
        await refreshData();
        await getChartData(); // Atualizar dados do gráfico
      }
    } catch (error) {
      console.error("Error handling new item:", error);
    }
  };

  const handleEdit = async (item: any) => {
    try {
      const modalType =
        pathname.slice(-1) === "s"
          ? "edit-" + pathname.split("/")[1].slice(0, -1)
          : "edit-" + pathname.split("/")[1];
      const result = await openModal(modalType, item);
      if (result?.success) {
        await refreshData();
        await getChartData(); // Atualizar dados do gráfico
      }
    } catch (error) {
      console.error("Error handling edit item:", error);
    }
  };

  const handleDeleteMany = async (selectedIds: number[]) => {
    let response: any;
    if (pathname === "/products") {
      response = await deleteManyProducts(selectedIds);
    } else if (pathname === "/customers") {
      response = await deleteManyCustomers(selectedIds);
    } else if (pathname === "/invoices") {
      response = await deleteManyInvoices(selectedIds);
    } else if (pathname === "/stock-movement") {
      response = await deleteManyStockMovements(selectedIds);
    } else {
      return;
    }

    if (response.success) {
      await refreshData();
      await getChartData(); // Atualizar dados do gráfico
      toast.success(response.message || "Item(s) deletado(s) com sucesso!");
    } else {
      toast.error(response.message || "Erro ao deletar item(s) selecionado(s)");
    }
  };

  const getNumberRange = (input: string) => {
    if (!input) return [undefined, undefined];
    if (input.includes("-")) {
      const [min, max] = input
        .split("-")
        .map((v) => (v ? Number(v) : undefined));
      return [min, max];
    }
    const num = Number(input);
    return [num, num];
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const timeoutId = setTimeout(() => {
      if (
        table.getColumn(selectedColumn)?.columnDef.filterFn === "inNumberRange"
      ) {
        setColumnFilters([
          { id: selectedColumn, value: getNumberRange(e.target.value) },
        ]);
      } else {
        setColumnFilters([{ id: selectedColumn, value: e.target.value }]);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  };

  return (
    <>
      <div>
        <div className="grid gap-2 py-4 lg:flex lg:items-center lg:justify-between">
          {/* Mobile: Empilhado verticalmente | Desktop: Flex horizontal */}
          <div className="grid gap-2 lg:flex lg:items-center lg:gap-2">
            <Input
              className="w-full md:w-auto"
              placeholder="Filtrar..."
              value={inputValue}
              onChange={handleFilterChange}
            />
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="Selecione uma coluna">
                  {columnTranslations[selectedColumn] || selectedColumn}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanFilter())
                    .map((column) => {
                      return (
                        <SelectItem
                          key={column.id}
                          value={column.id}
                          className="capitalize"
                        >
                          {columnTranslations[column.id] || column.id}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Botões de ação */}
          <div className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-2">
            <Button
              className="w-full md:w-auto"
              onClick={() => handleNew(pathname)}
            >
              <IconPlus />
              Adicionar{" "}
              {pathname === "/products"
                ? "Produto"
                : pathname === "/customers"
                  ? "Cliente"
                  : pathname === "/invoices"
                    ? "Venda"
                    : pathname === "/stock-movement"
                      ? "Estoque"
                      : ""}
            </Button>
            <Button
              className="w-full md:w-auto"
              variant="outline"
              disabled={table.getFilteredSelectedRowModel().rows.length !== 1}
              onClick={() => {
                const row = table.getFilteredSelectedRowModel().rows[0];
                if (row) {
                  handleEdit(row.original);
                }
              }}
            >
              <IconEdit />
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full md:w-auto"
                  disabled={
                    table.getFilteredSelectedRowModel().rows.length === 0
                  }
                  variant={"outline"}
                >
                  <IconTrash /> Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Você tem certeza absoluta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá
                    permanentemente os dados selecionados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteMany(
                        table
                          .getFilteredSelectedRowModel()
                          .rows.map((row) => row.original.id) as number[],
                      )
                    }
                  >
                    <IconTrash /> Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full md:w-auto" variant="outline">
                  <IconLayoutColumns /> Colunas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {columnTranslations[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="scrollbar-horizontal mx-auto w-full overflow-x-auto rounded-lg">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Não foram encontrados resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Mobile: Layout compacto empilhado | Desktop: Layout horizontal */}
          <div className="space-y-4 py-4 md:flex md:items-center md:justify-between md:space-y-0">
            {/* Informações de seleção - Mobile: Primeira linha | Desktop: Lado esquerdo */}
            <div className="text-muted-foreground text-center text-sm md:text-left">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span className="font-medium">
                  {table.getFilteredSelectedRowModel().rows.length} selecionada
                  {table.getFilteredSelectedRowModel().rows.length !== 1
                    ? "s"
                    : ""}
                </span>
              )}
              {table.getFilteredSelectedRowModel().rows.length > 0 &&
                table.getFilteredRowModel().rows.length > 0 && (
                  <span className="mx-2">•</span>
                )}
              <span>
                {table.getFilteredRowModel().rows.length} resultado
                {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Controles de paginação - Mobile: Segunda linha | Desktop: Lado direito */}
            <div className="flex flex-col items-center gap-4 md:flex-row">
              {/* Seletor de linhas por página - Visível em mobile também */}
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="rows-per-page"
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Por página:
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-fit" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Navegação de páginas */}
              <div className="flex items-center gap-2">
                {/* Informação da página atual - compacta */}
                <div className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                  {table.getPageCount() > 0 ? (
                    <>
                      <span className="hidden sm:inline">Página </span>
                      {table.getState().pagination.pageIndex + 1}
                      <span className="mx-1">/</span>
                      {table.getPageCount()}
                    </>
                  ) : (
                    <span>0/0</span>
                  )}
                </div>

                {/* Botões de navegação */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 sm:flex"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Primeira página</span>
                    <IconChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Página anterior</span>
                    <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Próxima página</span>
                    <IconChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 sm:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Última página</span>
                    <IconChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
