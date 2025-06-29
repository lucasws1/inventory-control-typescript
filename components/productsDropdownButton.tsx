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
          <Button className="flex w-full cursor-pointer">
            <ShoppingCart />
            Produtos
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link
              href="/products"
              className="flex cursor-pointer items-center gap-2"
            >
              <ListOrdered />
              Listar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/products/new-product"
              className="flex cursor-pointer items-center gap-2"
            >
              <Plus /> Adicionar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProductsDropdownButton;
