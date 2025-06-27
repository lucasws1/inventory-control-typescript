import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListOrdered, Plus, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const CustomersDropdownButton = () => {
  return (
    <div className="w-full items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex w-full cursor-pointer">
            <UserCircle />
            Clientes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/customers" className="flex items-center gap-2">
              <ListOrdered />
              Listar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Plus />{" "}
            <Link
              href="/customers/new-customer"
              className="flex items-center gap-2"
            >
              Adicionar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CustomersDropdownButton;
