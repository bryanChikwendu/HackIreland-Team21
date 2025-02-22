"use client";

import { Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      <h1 className="text-xl font-semibold hidden lg:block">Security Dashboard</h1>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
