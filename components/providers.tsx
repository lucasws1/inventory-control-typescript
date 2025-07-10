"use client";

import { ModalProvider } from "@/contexts/ModalContext";
import GlobalModalManager from "@/components/GlobalModalManager";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ModalProvider>
        {children}
        <GlobalModalManager />
        <Toaster />
      </ModalProvider>
    </SessionProvider>
  );
}
