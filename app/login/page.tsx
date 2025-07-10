"use client";

import { redirect } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import OverlaySkeleton from "@/components/overlaySkeleton";

export default function LoginPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Se já estiver logado, redireciona para o dashboard
    if (status === "authenticated") {
      redirect("/");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div>
        <OverlaySkeleton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Controle de Estoque
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Faça login para acessar o sistema
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              Entrar com Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
