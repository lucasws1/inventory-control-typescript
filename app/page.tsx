"use server";

import TopCards from "@/components/topCards";
import { redirect } from "next/navigation";

const Home = async () => {
  redirect("/invoices");
  return (
    // <div className="mx-2 space-y-4 font-sans md:mx-auto md:max-w-[80%]">
    <div>
      <TopCards />
    </div>
  );
};

export default Home;
