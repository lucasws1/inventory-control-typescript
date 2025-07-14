"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TestSonner() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Sucesso!", {
            description: "Esta notificação deve aparecer no topo da tela",
          })
        }
      >
        Toast de Sucesso
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.error("Erro!", {
            description: "Esta notificação também deve aparecer no topo",
          })
        }
      >
        Toast de Erro
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast("Info", {
            description: "Notificação normal no topo da tela",
            action: {
              label: "Desfazer",
              onClick: () => toast("Ação desfeita!"),
            },
          })
        }
      >
        Toast com Ação
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast.warning("Aviso!", {
            description: "Notificação de aviso no topo",
          })
        }
      >
        Toast de Aviso
      </Button>
    </div>
  );
}
