"use client";
import { Home, User, Briefcase, FileText } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

export default function NavigationBar() {
  const navItems = [
    { name: "Vendas", url: "/invoices", icon: Home },
    { name: "Clientes", url: "/customers", icon: User },
    { name: "Produtos", url: "/products", icon: Briefcase },
    { name: "Estoque", url: "/stock-movement", icon: FileText },
  ];

  return <NavBar items={navItems} />;
}
