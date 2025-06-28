import CustomersDropdownButton from "./customersDropdownButton";
import InvoicesDropdownButton from "./invoicesDropdownButton";
import ProductsDropdownButton from "./productsDropdownButton";
import StockMovementDropdownButton from "./stockMovementDropDownButton";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function CardFromTopCards({
  title,
  subtitle,
  info,
}: {
  title: string;
  subtitle: string;
  info: string;
}) {
  return (
    <div>
      <Card className="flex h-full flex-col justify-between">
        <CardHeader className="w-full">
          <div className="flex flex-col">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <CardAction className="w-fit">{info}</CardAction>
        </CardHeader>
        <CardFooter className="flex w-full">
          {title === "Produtos" ? (
            <ProductsDropdownButton />
          ) : title == "Clientes" ? (
            <CustomersDropdownButton />
          ) : title === "Estoque" ? (
            <StockMovementDropdownButton />
          ) : title === "Vendas" ? (
            <InvoicesDropdownButton />
          ) : (
            ""
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
