"use client";

import "@/app/global.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Centrion - Context-Aware Security Surveillance</title>
        <meta name="description" content="AI-powered surveillance system that understands context rather than just recording footage" />
      </head>
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
