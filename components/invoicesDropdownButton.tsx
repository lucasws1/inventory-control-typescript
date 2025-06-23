import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ListOrdered, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const InvoicesDropdownButton = () => {
  return (
    <div className="w-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex w-full">
            <FileText />
            Vendas
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/invoices" className="flex items-center gap-2">
              <ListOrdered />
              Listar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus /> Adicionar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InvoicesDropdownButton;
