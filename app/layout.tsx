import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopPageName from "@/components/topPageName";
import TopCards from "@/components/topCards";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark mt-2 space-y-2 antialiased`}
      >
        <div className="mx-2 space-y-4 font-[family-name:var(--font-geist-sans)] md:mx-auto md:max-w-[90%]">
          <TopPageName />
          <TopCards />
          {children}
        </div>
      </body>
    </html>
  );
}
