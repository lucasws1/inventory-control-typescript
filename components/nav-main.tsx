"use client";

import {
  IconBox,
  IconDots,
  IconList,
  IconMail,
  IconPlus,
  IconShoppingCart,
  IconUser,
  type Icon,
} from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useModal } from "@/contexts/ModalContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathName = usePathname();
  const isMobile = useIsMobile();
  const { openModal } = useModal();
  const { setOpenMobile } = useSidebar();

  const handleNewCustomer = () => {
    openModal("new-customer");
  };

  const handleNewProduct = () => {
    openModal("new-product");
  };

  const handleNewStockMovement = () => {
    openModal("new-stock-movement");
  };

  const handleNewInvoice = () => {
    openModal("new-invoice");
  };

  // Função para fechar sidebar no mobile quando link é clicado
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex w-full items-center gap-2">
              <SidebarMenuButton
                asChild
                className="hover:bg-yellow-500"
                tooltip="Quick Create"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex w-full flex-1 items-center justify-center gap-2 pl-2">
                      <IconPlus className="text-primary-foreground size-4" />
                      Novo documento
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-primary text-primary-foreground">
                    <DropdownMenuItem
                      className="hover:text-primary-foreground focus:text-primary-foreground flex items-center gap-2 hover:bg-stone-400/60 focus:bg-stone-400/60"
                      onClick={handleNewProduct}
                    >
                      <IconShoppingCart className="text-primary-foreground size-4" />
                      Novo produto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:text-primary-foreground focus:text-primary-foreground hover:bg-stone-400/60 focus:bg-stone-400/60"
                      onClick={handleNewStockMovement}
                    >
                      <IconBox className="text-primary-foreground size-4" />
                      Novo estoque
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:text-primary-foreground focus:text-primary-foreground hover:bg-stone-400/60 focus:bg-stone-400/60"
                      onClick={handleNewCustomer}
                    >
                      <IconUser className="text-primary-foreground size-4" />
                      Novo cliente
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:text-primary-foreground focus:text-primary-foreground hover:bg-stone-400/60 focus:bg-stone-400/60"
                      onClick={handleNewInvoice}
                    >
                      <IconShoppingCart className="text-primary-foreground size-4" />
                      Nova venda
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <IconMail />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className={
                    pathName === item.url
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }
                >
                  <Link href={item.url} onClick={handleLinkClick}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="data-[state=open]:bg-accent rounded-sm"
                    >
                      <IconDots />
                      <span className="sr-only">Mais</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-24 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    {item.title === "Clientes" ? (
                      <DropdownMenuItem onClick={handleNewCustomer}>
                        <IconPlus />
                        <span>Novo</span>
                      </DropdownMenuItem>
                    ) : item.title === "Estoque" ? (
                      <DropdownMenuItem onClick={handleNewStockMovement}>
                        <IconPlus />
                        <span>Novo</span>
                      </DropdownMenuItem>
                    ) : item.title === "Produtos" ? (
                      <DropdownMenuItem onClick={handleNewProduct}>
                        <IconPlus />
                        <span>Novo</span>
                      </DropdownMenuItem>
                    ) : item.title === "Vendas" ? (
                      <DropdownMenuItem onClick={handleNewInvoice}>
                        <IconPlus />
                        <span>Novo</span>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href={item.url} onClick={handleLinkClick}>
                        <IconList />
                        <span>Listar</span>
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <IconTrash />
                      <span>Deletar</span>
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
