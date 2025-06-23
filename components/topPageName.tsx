"use client";
import { Button } from "@/components/ui/button";

import { Path } from "@/types/path";
import { TitleInfo } from "@/types/titleInfo";
import {
  ChartNoAxesCombined,
  CircleUser,
  FileText,
  Menu,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
// import { Button } from "./ui/button";

export default function TopPageName() {
  const pathname = usePathname();

  const titles: Record<Path, TitleInfo> = {
    [Path.Home]: { label: "Painel", icon: <ChartNoAxesCombined /> },
    [Path.Customers]: { label: "Clientes", icon: <CircleUser /> },
    [Path.Products]: { label: "Produtos", icon: <ShoppingCart /> },
    [Path.Invoices]: { label: "Vendas", icon: <FileText /> },
    [Path.StockMovement]: { label: "Estoque", icon: <Package /> },
  };

  let title: TitleInfo | undefined;

  if (titles[pathname as Path]) {
    title = titles[pathname as Path];
  } else if (pathname.includes("/customers/")) {
    title = {
      label: "Editar Cliente",
      icon: <User />,
    };
  } else {
    title = {
      label: "Oi?",
      icon: <User />,
    };
  }

  return (
    <div className="flex items-center justify-center md:mx-auto md:max-w-[95%]">
      <div className="items-center">
        <div className="flex items-center gap-2 text-neutral-400">
          {title.icon}
          <h1 className="bg-gradient-to-l from-zinc-600 via-stone-500 to-neutral-400 bg-clip-text text-3xl text-transparent">
            {title.label}
          </h1>
        </div>
      </div>
    </div>
  );
}
