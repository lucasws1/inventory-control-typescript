import { columns, Invoice, Payment } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Invoice[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
      customer: "João",
      products: "caixa, papel",
      amount: 12000,
      status: "pending",
      email: "joao@example.com",
    },
    {
      id: 2,
      purchaseDate: new Date().toLocaleDateString("pt-BR"),
      customer: "João Paulo",
      products: "caixa, papel, tomate",
      amount: 15000,
      status: "pending",
      email: "joaopaulo@example.com",
    },
    // ...
  ];
}

export default async function dataTablePage() {
  const data = (await getData()) as Invoice[];
  console.log(data);

  return (
    <div className="mx-auto">
      <DataTable columns={columns} data={data as Invoice[]} />
    </div>
  );
}
