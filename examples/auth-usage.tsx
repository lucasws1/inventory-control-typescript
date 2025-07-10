// Exemplo de como usar a autenticação NextAuth v5 em um componente

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <h1>Página Protegida</h1>
      <p>Olá, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      {session.user.image && (
        <img
          src={session.user.image}
          alt="Avatar"
          className="h-10 w-10 rounded-full"
        />
      )}
    </div>
  );
}

// Para componentes client-side, use useSession do next-auth/react:
/*
"use client";

import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Not authenticated</p>;

  return <p>Welcome {session?.user?.name}!</p>;
}
*/
