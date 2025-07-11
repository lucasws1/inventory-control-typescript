"use client";

import { SessionProvider } from "next-auth/react";
import { DataProvider } from "@/contexts/DataContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { ChartDataProvider } from "@/contexts/ChartDataContext";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DataProvider>
        <ChartDataProvider>
          <ModalProvider>
            {children}
            <Toaster />
          </ModalProvider>
        </ChartDataProvider>
      </DataProvider>
    </SessionProvider>
  );
}
