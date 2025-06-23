import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ListOrdered, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const ProductsDropdownButton = () => {
  return (
    <div className="w-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex w-full">
            <ShoppingCart />
            Produtos
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/products" className="flex items-center gap-2">
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

export default ProductsDropdownButton;
