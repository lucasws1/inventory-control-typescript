import { Providers } from "@/components/providers";
import { DataProvider } from "@/contexts/DataContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Inventory Control",
    template: "%s | Inventory Control",
  },
  description: "inventory control app by lucas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hidden" suppressHydrationWarning>
      <body className="scrollbar-hidden">
        <DataProvider>
          <Providers>{children}</Providers>
        </DataProvider>
      </body>
    </html>
  );
}
