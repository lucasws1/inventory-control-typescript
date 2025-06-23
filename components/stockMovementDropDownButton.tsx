import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListOrdered, Package, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const StockMovementDropdownButton = () => {
  return (
    <div className="w-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex w-full">
            <Package />
            Estoque
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/stock-movement" className="flex items-center gap-2">
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

export default StockMovementDropdownButton;
