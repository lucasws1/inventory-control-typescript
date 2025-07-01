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
      <Card className="bg-gradient-card flex h-full flex-col justify-between truncate font-sans">
        <CardHeader className="w-full">
          <div className="flex flex-col">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="">{subtitle}</CardDescription>
          </div>
          <CardAction className="font-bold">{info}</CardAction>
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
