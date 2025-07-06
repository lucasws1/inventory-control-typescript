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
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useId, useMemo, useState } from "react";

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
import { useModal } from "@/contexts/ModalContext";
import { Customer } from "@/types/customer";
import { Invoice } from "@/types/invoice";
import { Product } from "@/types/product";
import { StockMovement } from "@/types/stockMovement";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

// Create a separate component for the drag handle
export function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

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

// Ensure table rows carry a unique identifier
type RowWithId = { id: UniqueIdentifier };

interface DataTableProps<TData extends RowWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DraggableRow<TData extends RowWithId>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<TData extends RowWithId, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(() => initialData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const pathname = usePathname();

  // Adicionar verificação de segurança para o useModal
  let openModal: any;
  try {
    const modalContext = useModal();
    openModal = modalContext.openModal;
  } catch (error) {
    console.warn("Modal context not available:", error);
    openModal = () => {};
  }

  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

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

  const handleNewInvoice = async () => {
    try {
      const result = await openModal("new-invoice");
      if (result?.success) {
        // Log da estrutura da invoice para debug
        console.log(
          "Invoice structure:",
          JSON.stringify(result.data.invoice, null, 2),
        );

        // Atualizar a tabela com os novos dados
        setData((currentData) => [result.data.invoice, ...currentData]);
      } else if (result?.cancelled) {
        // Modal foi cancelado, não precisa fazer nada
        console.log("Modal cancelled");
      }
    } catch (error) {
      console.error("Error handling new invoice:", error);
      toast.error("Erro ao processar nova venda");
    }
  };

  const handleNewProduct = () => openModal("new-product");
  const handleNewCustomer = () => openModal("new-customer");
  const handleNewStockMovement = () => openModal("new-stock-movement");
  const handleEditCustomer = (customer: Customer) =>
    openModal("edit-customer", customer);
  const handleEditProduct = (product: Product) =>
    openModal("edit-product", product);
  const handleEditInvoice = (invoice: Invoice) =>
    openModal("edit-invoice", invoice);
  const handleEditStockMovement = (stockMovement: StockMovement) =>
    openModal("edit-stock-movement", stockMovement);

  const handleDeleteMany = async (selectedIds: number[]) => {
    try {
      const response = await axios.delete(`/api/${pathname.slice(1)}`, {
        data: { ids: selectedIds },
      });

      // Verificar se a resposta foi bem-sucedida
      if (response.status >= 200 && response.status < 300) {
        // Determinar o tipo de item baseado no pathname
        const itemType =
          pathname === "/products"
            ? "produto(s)"
            : pathname === "/customers"
              ? "cliente(s)"
              : pathname === "/invoices"
                ? "venda(s)"
                : pathname === "/stock-movement"
                  ? "movimentação(ões) de estoque"
                  : "item(s)";

        // Verificar quantos itens foram realmente deletados
        const deletedCount = response.data?.deletedCount || selectedIds.length;

        // Atualizar a tabela localmente removendo os itens deletados
        setData((currentData) =>
          currentData.filter(
            (item) => !selectedIds.includes(item.id as number),
          ),
        );

        // Limpar seleção após deletar
        setRowSelection({});

        // Exibir toast de sucesso com informações detalhadas
        toast.success(`${deletedCount} ${itemType} deletado(s) com sucesso!`, {
          description: `Os itens foram removidos do sistema.`,
          duration: 5000,
        });

        console.log(
          `Successfully deleted ${deletedCount} items from ${pathname}`,
          response.data,
        );
      } else {
        // Resposta não foi bem-sucedida
        throw new Error(`Erro HTTP: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error deleting items:", error);

      // Determinar a mensagem de erro baseada no tipo de erro
      let errorMessage =
        "Ocorreu um erro ao tentar deletar os itens selecionados.";
      let errorDescription = "Tente novamente.";

      if (error.response) {
        // Erro de resposta da API
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 400) {
          errorMessage = "Dados inválidos";
          errorDescription =
            errorData?.error || "Verifique os itens selecionados.";
        } else if (status === 404) {
          errorMessage = "Itens não encontrados";
          errorDescription = "Os itens podem já ter sido deletados.";
        } else if (status === 500) {
          errorMessage = "Erro interno do servidor";
          errorDescription = errorData?.error || "Tente novamente mais tarde.";
        } else {
          errorMessage = `Erro HTTP ${status}`;
          errorDescription = errorData?.error || "Erro desconhecido.";
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = "Erro de conexão";
        errorDescription = "Verifique sua conexão com a internet.";
      }

      // Exibir toast de erro
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 5000,
      });
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

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
        <div className="flex items-center justify-between py-4">
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
          <div className="flex items-center gap-2">
            <Button
              onClick={
                pathname === "/products"
                  ? handleNewProduct
                  : pathname === "/customers"
                    ? handleNewCustomer
                    : pathname === "/invoices"
                      ? handleNewInvoice
                      : pathname === "/stock-movement"
                        ? handleNewStockMovement
                        : undefined
              }
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
              variant="outline"
              disabled={table.getFilteredSelectedRowModel().rows.length !== 1}
              onClick={() => {
                const row = table.getFilteredSelectedRowModel().rows[0];
                if (row) {
                  if (pathname === "/products") {
                    handleEditProduct(row.original as unknown as Product);
                  } else if (pathname === "/customers") {
                    handleEditCustomer(row.original as unknown as Customer);
                  } else if (pathname === "/invoices") {
                    handleEditInvoice(row.original as unknown as Invoice);
                  } else if (pathname === "/stock-movement") {
                    handleEditStockMovement(
                      row.original as unknown as StockMovement,
                    );
                  }
                }
              }}
            >
              <IconEdit />
              Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
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
                <Button variant="outline">
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
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="scrollbar-hidden mx-auto w-full overflow-x-auto rounded-lg">
          <div className="overflow-hidden rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
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
                <TableBody className="scrollbar-hidden **:data-[slot=table-cell]:first:w-8">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
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
            </DndContext>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} linhas selecionadas.
            </div>

            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Linhas por página:
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Página {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
