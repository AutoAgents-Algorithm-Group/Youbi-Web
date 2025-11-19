import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import BottomNav from "@/components/youbi/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youbi - You be yourself",
  description: "Youbi is a platform that helps you be yourself on TikTok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Toaster position="top-center" reverseOrder={false} />
        <main className="min-h-screen pb-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}