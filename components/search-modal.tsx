"use client";

import {
  IconSearch,
  IconUser,
  IconBox,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchResult {
  type: "customer" | "product" | "invoice" | "stockMovement";
  id: number;
  title: string;
  subtitle: string;
  url: string;
  icon: string;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const response = await axios.get(
            `/api/search?q=${encodeURIComponent(query)}`,
          );

          setResults(response.data.results || []);
        } catch (error) {
          console.error("Erro na pesquisa:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 1000);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const selectedResult = results[selectedIndex];
      if (selectedResult) {
        router.push(selectedResult.url + "/" + selectedResult.id);
        onOpenChange(false);
        setQuery("");
        setResults([]);
        // Fechar sidebar no mobile após navegação
        if (isMobile) {
          setOpenMobile(false);
        }
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url + "/" + result.id);
    onOpenChange(false);
    setQuery("");
    setResults([]);
    // Fechar sidebar no mobile após navegação
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case "user":
        return <IconUser className="h-4 w-4" />;
      case "box":
        return <IconBox className="h-4 w-4" />;
      case "dollar":
        return <IconCurrencyDollar className="h-4 w-4" />;
      default:
        return <IconSearch className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "customer":
        return "Cliente";
      case "product":
        return "Produto";
      case "invoice":
        return "Fatura";
      case "stockMovement":
        return "Estoque";
      default:
        return "Item";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pesquisar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              placeholder="Buscar clientes, produtos, faturas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Buscando...</div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {results.map((result, index) => (
                  <Button
                    key={`${result.type}-${result.id}`}
                    variant={selectedIndex === index ? "secondary" : "ghost"}
                    className="h-auto w-full justify-start p-3"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex w-full items-center space-x-3">
                      <div className="shrink-0">{getIcon(result.icon)}</div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate font-medium">
                          {result.title}
                        </div>
                        <div className="text-muted-foreground truncate text-sm">
                          {result.subtitle}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="text-muted-foreground bg-muted rounded px-2 py-1 text-xs">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            </div>
          )}

          {query.length < 2 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">
                Digite pelo menos 2 caracteres para pesquisar
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
