"use client";

import { Path } from "@/types/path";
import {
  ChartNoAxesCombined,
  CircleUser,
  FileText,
  Package,
  ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopPageName() {
  const pathname = usePathname();

  const titles: { path: string; label: string; icon: React.ReactNode }[] = [
    { path: Path.Invoices, label: "Vendas", icon: <FileText /> },
    { path: Path.Home, label: "Painel", icon: <ChartNoAxesCombined /> },
    { path: Path.Customers, label: "Clientes", icon: <CircleUser /> },
    { path: Path.Products, label: "Produtos", icon: <ShoppingCart /> },
    { path: Path.StockMovement, label: "Estoque", icon: <Package /> },
  ];

  const currentTitle: { path: string; label: string; icon: React.ReactNode } =
    titles
      .sort((a, b) => a.path.length - b.path.length)
      .find(
        ({ path }) =>
          (path !== "/" && pathname.startsWith(path)) || path === pathname,
      ) ?? { path: Path.Home, label: "Home", icon: <ChartNoAxesCombined /> };

  return (
    <div className="flex items-center justify-center font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <div className="items-center">
        <div className="flex items-center gap-2 text-neutral-400">
          {currentTitle.icon}

          <h1 className="bg-gradient-to-l from-zinc-600 via-stone-500 to-neutral-400 bg-clip-text text-3xl text-transparent">
            {currentTitle.label}
          </h1>
        </div>
      </div>
    </div>
  );
}
