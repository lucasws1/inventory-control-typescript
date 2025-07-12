import DashboardWelcome from "@/components/DashboardWelcome";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Não precisa fazer redirect aqui, o middleware já cuida disso
  // Apenas mostra loading ou conteúdo baseado na sessão
  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name?.toString().split(" ")[0] || "";

  return <DashboardWelcome userName={userName} />;
}
