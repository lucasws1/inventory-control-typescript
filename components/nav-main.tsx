"use client";

import {
  IconCirclePlusFilled,
  IconDots,
  IconFolder,
  IconMail,
  IconShare3,
  IconPlus,
  IconTrash,
  type Icon,
  IconEdit,
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
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useModal } from "@/contexts/ModalContext";

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

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconPlus />
                <span>Novo documento</span>
              </SidebarMenuButton>
              <Button
                size="icon"
                className="size-8 group-data-[collapsible=icon]:opacity-0"
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
                  <Link href={item.url}>
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
                    <DropdownMenuItem>
                      <IconEdit />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <IconTrash />
                      <span>Deletar</span>
                    </DropdownMenuItem>
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
