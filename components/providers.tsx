"use client";

import { SessionProvider } from "next-auth/react";
import { DataProvider } from "@/contexts/DataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { ChartDataProvider } from "@/contexts/ChartDataContext";
import { Toaster } from "@/components/ui/sonner";
import GlobalModalManager from "@/components/GlobalModalManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DataProvider>
        <ChartDataProvider>
          <ModalProvider>
            {children}
            <GlobalModalManager />
            <Toaster />
          </ModalProvider>
        </ChartDataProvider>
      </DataProvider>
    </SessionProvider>
  );
}
