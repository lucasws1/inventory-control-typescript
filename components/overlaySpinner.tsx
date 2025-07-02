import React from "react";
import { Spinner, SpinnerProps } from "./spinners";

const OverlaySpinner = () => {
  const variants = [
    "default",
    "circle",
    "pinwheel",
    "circle-filled",
    "ellipsis",
    "ring",
    "bars",
    "infinite",
  ];

  const randomVariant = variants[
    Math.floor(Math.random() * variants.length)
  ] as SpinnerProps["variant"];
  return (
    <div className="absolute inset-0 flex h-full items-center justify-center gap-4 bg-black/80">
      <Spinner variant={randomVariant} size={100} />
    </div>
  );

  // return (
  //   <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px]">
  //     {/* TopCards Skeleton - 4 cards específicos da página de faturas */}
  //     <div className="mx-auto mt-15 max-w-[95%] space-y-4 font-sans">
  //       <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
  //         {/* Card Vendas */}
  //         <Card className="h-40">
  //           <CardHeader>
  //             <Skeleton className="mb-2 h-4 w-16" /> {/* "Estoque" */}
  //             <Skeleton className="mb-3 h-3 w-36" />{" "}
  //             {/* "Andamentos registrados" */}
  //             <Skeleton className="h-4 w-28" /> {/* "X andamentos" */}
  //           </CardHeader>
  //           <CardFooter className="flex justify-center">
  //             <Skeleton className="h-5 w-32" /> {/* Botão dropdown */}
  //           </CardFooter>
  //         </Card>

  //         {/* Card Clientes */}
  //         <Card className="h-40">
  //           <CardHeader>
  //             <Skeleton className="mb-2 h-4 w-16" /> {/* "Estoque" */}
  //             <Skeleton className="mb-3 h-3 w-36" />{" "}
  //             {/* "Andamentos registrados" */}
  //             <Skeleton className="h-4 w-28" /> {/* "X andamentos" */}
  //           </CardHeader>
  //           <CardFooter className="flex justify-center">
  //             <Skeleton className="h-5 w-32" /> {/* Botão dropdown */}
  //           </CardFooter>
  //         </Card>

  //         {/* Card Produtos */}
  //         <Card className="h-40">
  //           <CardHeader>
  //             <Skeleton className="mb-2 h-4 w-16" /> {/* "Estoque" */}
  //             <Skeleton className="mb-3 h-3 w-36" />{" "}
  //             {/* "Andamentos registrados" */}
  //             <Skeleton className="h-4 w-28" /> {/* "X andamentos" */}
  //           </CardHeader>
  //           <CardFooter className="flex justify-center">
  //             <Skeleton className="h-5 w-32" /> {/* Botão dropdown */}
  //           </CardFooter>
  //         </Card>

  //         {/* Card Estoque */}
  //         <Card className="h-40">
  //           <CardHeader>
  //             <Skeleton className="mb-2 h-4 w-16" /> {/* "Estoque" */}
  //             <Skeleton className="mb-3 h-3 w-36" />{" "}
  //             {/* "Andamentos registrados" */}
  //             <Skeleton className="h-4 w-28" /> {/* "X andamentos" */}
  //           </CardHeader>
  //           <CardFooter className="flex justify-center">
  //             <Skeleton className="h-5 w-32" /> {/* Botão dropdown */}
  //           </CardFooter>
  //         </Card>
  //       </div>

  //       {/* Table Skeleton - específico para tabela de faturas */}
  //       <div className="rounded-md border">
  //         <div className="overflow-x-auto">
  //           <table className="w-full">
  //             {/* Table Header - colunas específicas de faturas */}
  //             <thead>
  //               <tr className="bg-muted/50 border-b">
  //                 <th className="p-4 text-left">
  //                   <Skeleton className="h-4 w-12" /> {/* "Data" */}
  //                 </th>
  //                 <th className="p-4 text-left">
  //                   <Skeleton className="h-4 w-16" /> {/* "Nome" */}
  //                 </th>
  //                 <th className="p-4 text-left">
  //                   <Skeleton className="h-4 w-12" /> {/* "Item" */}
  //                 </th>
  //                 <th className="p-4 text-left">
  //                   <Skeleton className="h-4 w-14" /> {/* "Valor" */}
  //                 </th>
  //                 <th className="p-4 text-left">
  //                   <Skeleton className="h-4 w-16" /> {/* "Ações" */}
  //                 </th>
  //               </tr>
  //             </thead>
  //             {/* Table Body - linhas de faturas */}
  //             <tbody>
  //               {Array.from({ length: 10 }).map((_, rowIndex) => (
  //                 <tr key={rowIndex} className="hover:bg-muted/50 border-b">
  //                   <td className="p-4">
  //                     <Skeleton className="h-4 w-20" /> {/* Data */}
  //                   </td>
  //                   <td className="p-4">
  //                     <Skeleton className="h-4 w-32" /> {/* Nome do cliente */}
  //                   </td>
  //                   <td className="p-4">
  //                     <Skeleton className="h-4 w-24" /> {/* Item/produto */}
  //                   </td>
  //                   <td className="p-4">
  //                     <Skeleton className="h-4 w-16" /> {/* Valor */}
  //                   </td>
  //                   <td className="p-4">
  //                     <div className="flex gap-2">
  //                       <Skeleton className="h-8 w-8 rounded" />{" "}
  //                       {/* Botão ação */}
  //                       <Skeleton className="h-8 w-8 rounded" />{" "}
  //                       {/* Botão dropdown */}
  //                     </div>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default OverlaySpinner;
