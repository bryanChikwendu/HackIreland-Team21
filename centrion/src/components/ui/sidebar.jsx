"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Camera, Map, AlertTriangle, Users, Settings, Shield, LogOut, 
  X, Plus, Brain, Activity, Headphones, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // Sidebar collapse state

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[90] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <div
        className={`fixed top-0 left-0 ${collapsed ? "w-16" : "w-64"} h-full bg-slate-900 text-white z-[100] lg:static lg:block transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-blue-400" />
            {!collapsed && <span className="text-lg font-semibold ml-2">Centrion</span>}
          </div>
          {/* Sidebar Collapse Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6">
          <div className="pt-2">
            <Button
              className={`w-full ${collapsed ? "p-3 flex justify-center" : "justify-start"} bg-blue-500 hover:bg-blue-600 text-white`}
              asChild
            >
              <Link href="/add">
                <Plus className="w-4 h-4" />
                {!collapsed && <span className="ml-3">Add Camera</span>}
              </Link>
            </Button>
          </div>
          <div>
            {!collapsed && <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">Monitoring</h3>}
            <ul className="space-y-1">
              {[
                { name: "Cameras", icon: <Camera className="w-5 h-5" />, href: "/dashboard" },
                { name: "Locations", icon: <Map className="w-5 h-5" />, href: "/locations" },
                { name: "Alerts", icon: <AlertTriangle className="w-5 h-5" />, href: "/alerts" },
                { name: "Actions", icon: <Activity className="w-5 h-5" />, href: "/actions" },
                { name: "Listeners", icon: <Headphones className="w-5 h-5" />, href: "/listeners" },
                { name: "Intelligence", icon: <Brain className="w-5 h-5" />, href: "/intelligence" },
              ].map(({ name, icon, href }) => (
                <li key={name}>
                  <Button
                    variant="ghost"
                    className={`w-full ${collapsed ? "p-3 flex justify-center" : "justify-start"} ${
                      pathname === href ? "text-blue-400 font-semibold" : "text-slate-400"
                    }`}
                    asChild
                  >
                    <Link href={href}>
                      {icon}
                      {!collapsed && <span className="ml-3">{name}</span>}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {!collapsed && <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">System</h3>}
            <ul className="space-y-1">
              {[
                { name: "Users", icon: <Users className="w-5 h-5" />, href: "/users" },
                { name: "Settings", icon: <Settings className="w-5 h-5" />, href: "/settings" },
              ].map(({ name, icon, href }) => (
                <li key={name}>
                  <Button
                    variant="ghost"
                    className={`w-full ${collapsed ? "p-3 flex justify-center" : "justify-start"} ${
                      pathname === href ? "text-blue-400 font-semibold" : "text-slate-400"
                    }`}
                    asChild
                  >
                    <Link href={href}>
                      {icon}
                      {!collapsed && <span className="ml-3">{name}</span>}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost"
            className={`w-full ${collapsed ? "p-3 flex justify-center" : "justify-start"} text-white`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Log Out</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
