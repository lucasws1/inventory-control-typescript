"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconTrash, IconUser } from "@tabler/icons-react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AccountSettingsFormProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.put("/api/user/update", {
        name: name.trim(),
      });

      if (response.status === 200) {
        toast.success("Nome atualizado com sucesso!");
        // Atualizar a sessão para refletir as mudanças
        await update();
      } else {
        toast.error(response.data.message || "Erro ao atualizar nome");
      }
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      toast.error("Erro ao atualizar nome");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.delete("/api/user/delete");

      if (response.status === 200) {
        toast.success("Conta removida com sucesso");
        // Redirecionar para logout
        window.location.href = "/login";
      } else {
        toast.error(response.data.message || "Erro ao remover conta");
      }
    } catch (error) {
      console.error("Erro ao remover conta:", error);
      toast.error("Erro ao remover conta");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Informações do Usuário
          </CardTitle>
          <CardDescription>Gerencie suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editar Nome */}
      <Card>
        <CardHeader>
          <CardTitle>Editar Nome</CardTitle>
          <CardDescription>Atualize seu nome de exibição</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Remover Conta */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Remover conta</CardTitle>
          <CardDescription>
            Esta ação é irreversível. Todos os seus dados serão permanentemente
            removidos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <IconTrash className="h-4 w-4" />
                  {isDeleting ? "Removendo..." : "Remover conta"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá permanentemente
                    remover sua conta e todos os dados associados a ela.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, remover conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between gap-2">
        <Button variant="secondary" onClick={() => router.push("/")}>
          Voltar
        </Button>
        <Button variant="secondary" onClick={() => signOut()}>
          Sair
        </Button>
      </div>
    </div>
  );
}
