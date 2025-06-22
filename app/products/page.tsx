import AllInOneTable from "@/components/allInOneTable";
import TopCards from "@/components/topCards";
import prisma from "@/lib/prisma";
import { formatTableData } from "@/utils/formatTableData";
import { Prisma } from "../generated/prisma";
import { ProductsTableData } from "@/types/productsTableData";

const Products = async () => {
  const products: ProductsTableData[] = await prisma.product.findMany({
    include: {
      StockMovement: true,
    },
  });

  const tableData = products.map((prod) => {
    const quantityInStock = prod.StockMovement.reduce((acc, sm) => {
      if (sm.reason === "COMPRA") {
        return acc + sm.quantity;
      } else if (sm.reason === "VENDA") {
        return acc - sm.quantity;
      }
      return acc;
    }, 0);

    return {
      id: prod.id,
      col1: prod.name,
      col2: prod.price,
      col3: quantityInStock,
      col4: quantityInStock * prod.price,
    };
  });

  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />
      <AllInOneTable tableData={tableData} />
    </div>
  );
};

export default Products;
