import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Não precisa fazer redirect aqui, o middleware já cuida disso
  // Apenas mostra loading ou conteúdo baseado na sessão
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Bem-vindo ao Dashboard!
          </h1>
          <div className="mb-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Avatar"
                className="mx-auto mb-2 h-16 w-16 rounded-full"
              />
            )}
            <p className="text-gray-700 dark:text-gray-300">
              Olá, <span className="font-semibold">{session.user.name}</span>!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {session.user.email}
            </p>
          </div>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Sistema de Controle de Estoque
          </p>
        </div>
      </div>
    </div>
  );
}
