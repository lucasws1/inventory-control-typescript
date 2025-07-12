import { WelcomeCard } from "@/components/WelcomeCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <div className="mt-20">
        <WelcomeCard />
      </div>
    </div>
  );
}
