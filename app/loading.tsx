"use client";

import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      {/* TopCards Skeleton - 4 cards específicos da página de faturas */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {/* Card Vendas */}
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-5 w-16" /> {/* "Vendas" */}
            <Skeleton className="mb-3 h-4 w-28" /> {/* "Em mês/ano" */}
            <Skeleton className="h-6 w-20" /> {/* "X vendas" */}
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-32" /> {/* Botão dropdown */}
          </CardFooter>
        </Card>

        {/* Card Clientes */}
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-5 w-16" /> {/* "Clientes" */}
            <Skeleton className="mb-3 h-4 w-32" />{" "}
            {/* "Clientes cadastrados" */}
            <Skeleton className="h-6 w-24" /> {/* "X clientes" */}
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-32" /> {/* Botão dropdown */}
          </CardFooter>
        </Card>

        {/* Card Produtos */}
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-5 w-20" /> {/* "Produtos" */}
            <Skeleton className="mb-3 h-4 w-28" /> {/* "Itens cadastrados" */}
            <Skeleton className="h-6 w-16" /> {/* "X itens" */}
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-32" /> {/* Botão dropdown */}
          </CardFooter>
        </Card>

        {/* Card Estoque */}
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-5 w-16" /> {/* "Estoque" */}
            <Skeleton className="mb-3 h-4 w-36" />{" "}
            {/* "Andamentos registrados" */}
            <Skeleton className="h-6 w-28" /> {/* "X andamentos" */}
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 w-32" /> {/* Botão dropdown */}
          </CardFooter>
        </Card>
      </div>

      {/* Table Skeleton - específico para tabela de faturas */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header - colunas específicas de faturas */}
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-12" /> {/* "Data" */}
                </th>
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-16" /> {/* "Nome" */}
                </th>
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-12" /> {/* "Item" */}
                </th>
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-14" /> {/* "Valor" */}
                </th>
                <th className="p-4 text-left">
                  <Skeleton className="h-4 w-16" /> {/* "Ações" */}
                </th>
              </tr>
            </thead>
            {/* Table Body - linhas de faturas */}
            <tbody>
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50 border-b">
                  <td className="p-4">
                    <Skeleton className="h-4 w-20" /> {/* Data */}
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-32" /> {/* Nome do cliente */}
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-24" /> {/* Item/produto */}
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-16" /> {/* Valor */}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded" />{" "}
                      {/* Botão ação */}
                      <Skeleton className="h-8 w-8 rounded" />{" "}
                      {/* Botão dropdown */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loading;
