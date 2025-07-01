"use client";

import { Button } from "@/components/ui/button";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mapeamento de traduções para os nomes das colunas
const columnTranslations: Record<string, string> = {
  select: "Seleção",
  date: "Data",
  product: "Produto",
  quantity: "Quantidade",
  reason: "Motivo",
  actions: "Ações",
  amount: "Valor",
  customer: "Cliente",
  email: "Email",
  purchaseDate: "Data",
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [selectedColumn, setSelectedColumn] = useState<string>(
    table.getAllColumns()[1]?.id || "",
  );
  const [inputValue, setInputValue] = useState<string>("");

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
    <div>
      <div className="flex py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrar..."
            value={inputValue}
            onChange={handleFilterChange}
          />

          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
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
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mx-auto w-full overflow-x-auto rounded-md border-2 border-neutral-900">
        <Table className="w-full">
          <TableHeader className="bg-card">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell
                      key={cell.id}
                      className="justify-center align-middle"
                    >
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center">
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount() || 1}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" /> Anterior
          </Button>
          <div className="text-muted-foreground flex-1 text-sm">
            Página{" "}
            <Button variant={"outline"}>
              {table.getState().pagination.pageIndex + 1}
            </Button>
            s de {table.getPageCount()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </div>
  );
}
