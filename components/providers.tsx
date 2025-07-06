"use client";

import { ModalProvider } from "@/contexts/ModalContext";
import GlobalModalManager from "@/components/GlobalModalManager";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <GlobalModalManager />
      <Toaster />
    </ModalProvider>
  );
}
