"use client";

import {
  IconBox,
  IconCamera,
  IconCurrencyDollar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconSearch,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";
import * as React from "react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { SearchModal } from "@/components/search-modal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSearch } from "@/hooks/use-search";
import { useSession } from "next-auth/react";

const data = {
  navMain: [
    {
      title: "Painel de Controle",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Produtos",
      url: "/products",
      icon: IconShoppingCart,
    },
    {
      title: "Estoque",
      url: "/stock-movement",
      icon: IconBox,
    },
    {
      title: "Clientes",
      url: "/customers",
      icon: IconUser,
    },
    {
      title: "Vendas",
      url: "/invoices",
      icon: IconCurrencyDollar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    // {
    //   title: "Configurações",
    //   url: "#",
    //   icon: IconSettings,
    // },

    {
      title: "Pesquisar",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Produto",
      url: "/products",
      icon: IconShoppingCart,
    },
    {
      name: "Estoque",
      url: "/stock-movement",
      icon: IconBox,
    },
    {
      name: "Cliente",
      url: "/customers",
      icon: IconUser,
    },
    {
      name: "Venda",
      url: "/invoices",
      icon: IconCurrencyDollar,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isOpen, setIsOpen } = useSearch();

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="#">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">
                    Controle de Estoque
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavDocuments items={data.documents} /> */}
          <NavSecondary
            items={data.navSecondary}
            className="mt-auto"
            onItemClick={(item) => {
              if (item.title === "Pesquisar") {
                handleSearchClick();
              }
            }}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <SearchModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
