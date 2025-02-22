"use client";

import "@/app/global.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
