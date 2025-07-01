import NavigationBar from "@/components/navigationBar";
import TopCards from "@/components/topCards";
import TopPageName from "@/components/topPageName";
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
    <html lang="en">
      <body className="dark">
        <div>{children}</div>
      </body>
    </html>
    // <html lang="en">
    //   <body className="dark">
    //     <div className="mx-2 mt-2 space-y-4 lg:mx-auto lg:max-w-5xl">
    //       <NavigationBar />
    //       {/* <TopPageName /> */}
    //       <TopCards />
    //       {children}
    //     </div>
    //   </body>
    // </html>
  );
}
