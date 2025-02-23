"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockAlerts } from "@/lib/mock-data";

export function Header({ setIsSidebarOpen }) {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [theme, setTheme] = useState("light"); // Default to light mode
  const router = useRouter();

  useEffect(() => {
    // Load theme from localStorage or use system preference
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    setActiveAlerts(mockAlerts.filter((alert) => alert.status === "active"));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 h-16 flex items-center justify-between px-6 lg:px-8 z-[90] relative shadow-md dark:shadow-lg">
      {/* Sidebar Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden text-black dark:text-white z-[200] border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Dashboard Title */}
      <h1 className="text-xl font-semibold hidden lg:block dark:text-white">Dashboard</h1>

      <div className="flex items-center space-x-4">
        {/* Alerts Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="relative border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell className="h-5 w-5 dark:text-white" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[250px] w-auto bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-700 rounded-md z-[200]">
            <DropdownMenuItem onClick={() => router.push("/alerts")} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle Button */}
        <Button 
          variant="outline" 
          size="icon" 
          className="border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon className="h-5 w-5 text-gray-700" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </Button>

        {/* Settings Button */}
        {/* <Button 
          variant="outline" 
          size="icon" 
          className="border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-5 w-5 dark:text-white" />
        </Button> */}
      </div>
    </header>
  );
}
