import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/providers/ToastContext";

import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

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
        <AuthProvider>
          <ToastProvider>
            <Toaster/>
            <ModalProvider/>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


