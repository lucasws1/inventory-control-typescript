"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const areas: Record<string, string> = {
    invoices: "Vendas",
    products: "Produtos",
    customers: "Clientes",
    "stock-movement": "Movimentação de Estoque",
    dashboard: "Painel de Controle",
    "": "Painel",
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {areas[pathname.split("/").pop() || ""] || "Painel"}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </Link>
          </Button> */}
        </div>
      </div>
    </header>
  );
}
