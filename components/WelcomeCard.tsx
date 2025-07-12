"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconLogin } from "@tabler/icons-react";

interface WelcomeCardProps {
  className?: string;
}

export const WelcomeCard = ({ className }: WelcomeCardProps) => {
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll automático apenas no mobile e após login/carregamento inicial
    if (isMobile && cardRef.current && status !== "loading") {
      const timer = setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }, 800); // Delay maior para melhor experiência

      return () => clearTimeout(timer);
    }
  }, [isMobile, status]);

  const handleLogin = () => {
    signIn("google");
  };

  const handleLogout = () => {
    signOut();
  };

  const userName = session?.user?.name || "Visitante";
  const userImage = session?.user?.image || "/defaultUserImage.png";
  const isAuthenticated = status === "authenticated";

  return (
    <div
      id="welcome-card"
      className="flex min-h-screen items-center justify-center py-20"
    >
      <div
        ref={cardRef}
        className={cn(
          "relative mx-4 w-full max-w-2xl overflow-hidden rounded-3xl p-1",
          "bg-gradient-to-r from-slate-700 via-slate-800 to-gray-800",
          "animate-gradient-x shadow-2xl shadow-slate-800/25",
          className,
        )}
      >
        {/* Camada de glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl">
          {/* Efeitos de fundo animados */}
          <div className="absolute inset-0">
            {/* Gradiente principal */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-slate-800/20 to-gray-800/20" />

            {/* Orbs flutuantes */}
            <div className="absolute -top-10 -left-10 h-40 w-40 animate-pulse rounded-full bg-slate-600/30 blur-3xl" />
            <div className="absolute -right-10 -bottom-10 h-40 w-40 animate-pulse rounded-full bg-gray-700/30 blur-3xl delay-1000" />
            <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-slate-500/20 blur-2xl" />

            {/* Grid pattern sutil */}
            <div className="absolute inset-0 bg-[url(/grid-ellipsis.svg)] bg-[length:50px_50px] opacity-10" />
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 px-8 py-12 text-center">
            {/* Avatar do usuário */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                {/* Ring animado ao redor do avatar */}
                <div
                  className="absolute -inset-2 animate-spin rounded-full bg-gradient-to-r from-slate-600 via-slate-700 to-gray-600"
                  style={{ animationDuration: "2s" }}
                />
                <div className="relative overflow-hidden rounded-full bg-black p-1">
                  <Image
                    src={userImage}
                    alt="Avatar do usuário"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Título principal */}
            <h1 className="mb-4 bg-gradient-to-r from-white via-slate-200 to-gray-200 bg-clip-text text-4xl font-bold text-transparent md:text-2xl">
              {isAuthenticated ? `Bem-vindo, ${userName}!` : "Bem-vindo!"}
            </h1>

            {/* Descrição */}
            <p className="md:text-md mb-8 text-lg text-gray-300">
              {isAuthenticated
                ? "Selecione uma opção no menu"
                : "Faça login para acessar seu painel de controle"}
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleLogout}
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg transition-all duration-300 hover:from-slate-600 hover:to-slate-700 hover:shadow-slate-700/25"
                  >
                    <IconLogin className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Fazer Logout
                    {/* Efeito shimmer */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg transition-all duration-300 hover:from-slate-600 hover:to-slate-700 hover:shadow-slate-700/25"
                >
                  <IconLogin className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Entrar com Google
                  {/* Efeito shimmer */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Button>
              )}
            </div>

            {/* Badge de status */}
          </div>

          {/* Shine effect */}
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
};

// Estilos CSS customizados via Tailwind (adicionar ao globals.css)
export const welcomeCardStyles = `
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 4s ease infinite;
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}
`;
