import AllInOneTable from "@/components/allInOneTable";
import CustomersTable from "@/components/allInOneTable";
import DashboardTable from "@/components/dashboardTable";
import TopCards from "@/components/topCards";

export default async function Home() {
  return (
    <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[95%]">
      <TopCards />

      <AllInOneTable />
    </div>
  );
}
