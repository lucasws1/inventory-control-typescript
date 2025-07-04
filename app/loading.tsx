"use client";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="mx-2 space-y-4 py-4 font-sans md:mx-auto">
      <div className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-54" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-9 w-26" />
      </div>
      {/* Table Skeleton - específico para tabela de faturas */}
      <div className="rounded-md border">
        <div className="scrollbar-hidden overflow-x-auto">
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
