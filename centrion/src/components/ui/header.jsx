"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockAlerts } from "@/lib/mock-data";

export function Header({ setIsSidebarOpen }) {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setActiveAlerts(mockAlerts.filter((alert) => alert.status === "active"));
  }, []);

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8 z-[90] relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden text-black z-[200]" 
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <h1 className="text-xl font-semibold hidden lg:block">Dashboard</h1>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[250px] w-auto bg-white shadow-md border border-gray-200 rounded-md z-[200]">
            <DropdownMenuItem onClick={() => router.push("/alerts")}>View all alerts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
