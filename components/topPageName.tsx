"use client";

import { Path } from "@/types/path";
import { TitleInfo } from "@/types/titleInfo";
import { ChartNoAxesCombined, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function TopPageName() {
  const pathname = usePathname();

  const titles: Record<Path, TitleInfo> = {
    [Path.Home]: { label: "Painel", icon: <ChartNoAxesCombined /> },
    [Path.Customers]: { label: "Adicionar Cliente", icon: <User /> },
    [Path.Products]: { label: "Adicionar Produto", icon: <Package /> },
  };

  const title = titles[pathname as Path] || {
    label: "Título",
    icon: <User />,
  };

  return (
    <div className="flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-4 text-3xl">
        <Button asChild variant="outline" size="icon" className="">
          <Link href="/">{title.icon}</Link>
        </Button>
        {title.label}
      </div>
    </div>
  );
}
