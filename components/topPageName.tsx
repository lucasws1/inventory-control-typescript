"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Path } from "@/types/path";
import { TitleInfo } from "@/types/titleInfo";
import {
  ChartNoAxesCombined,
  CircleUser,
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
    [Path.Products]: { label: "Produtos", icon: <Package /> },
    [Path.Invoices]: { label: "Faturas", icon: <ShoppingCart /> },
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
    <div className="mx-auto flex max-w-[95%] grid-cols-2 justify-between">
      <div className="items-center">
        <div className="flex items-center gap-2 text-neutral-400">
          {title.icon}
          <h1 className="bg-gradient-to-l from-zinc-600 via-stone-500 to-neutral-400 bg-clip-text text-3xl text-transparent">
            {title.label}
          </h1>
        </div>
      </div>
      <div className="items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="outline">{title.icon}</Button> */}
            <Button variant="outline">
              <Menu /> Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Clientes</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Listar</DropdownMenuItem>
                  <DropdownMenuItem>Adicionar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Mais...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Produtos</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Listar</DropdownMenuItem>
                  <DropdownMenuItem>Adicionar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Mais...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Faturas</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Listar</DropdownMenuItem>
                  <DropdownMenuItem>Adicionar</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Mais...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem>Home</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
