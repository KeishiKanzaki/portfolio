import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/providers/ToastContext";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | LearnLink 💬",
    default: "LearnLink 💬",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={cn(inter.className, "bg-gray-100/30")}> 
        <ToastProvider>
          <Toaster/>
          <ModalProvider/>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


