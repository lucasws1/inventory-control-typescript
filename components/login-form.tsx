"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconBrandGoogle, IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu email abaixo para entrar
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="desabilitado" disabled />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="desabilitado"
            disabled
          />
        </div>
        <Button type="submit" className="w-full" disabled>
          Entrar
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>

        <Button
          type="button"
          className="flex w-full items-center justify-center"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <IconBrandGoogleFilled />

          {isLoading ? "Entrando..." : "Entrar com Google"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="text-primary cursor-pointer border-none bg-transparent p-0 underline underline-offset-4"
        >
          Cadastre-se
        </button>
      </div>
    </form>
  );
}
