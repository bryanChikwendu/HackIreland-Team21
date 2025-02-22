"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Map, AlertTriangle, Users, Settings, Shield, LogOut, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

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
        className={`fixed top-0 left-0 w-64 h-full bg-slate-900 text-white z-[100] lg:static lg:block transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-400" />
            <span className="text-lg font-semibold">Centrion</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="p-4 space-y-6">
          <div className="pt-2">
              <Button
                className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white"
                asChild
              >
                <Link href="/add">
                  <Plus className="w-4 h-4 mr-3" />
                  <span>Add Camera</span>
                </Link>
              </Button>
            </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">Monitoring</h3>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/dashboard" ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                  asChild
                >
                  <Link href="/dashboard">
                    <Camera className="w-4 h-4 mr-3" />
                    <span>Cameras</span>
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/locations" ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                  asChild
                >
                  <Link href="/locations">
                    <Map className="w-4 h-4 mr-3" />
                    <span>Locations</span>
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/alerts" ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                  asChild
                >
                  <Link href="/alerts">
                    <AlertTriangle className="w-4 h-4 mr-3" />
                    <span>Alerts</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold text-slate-400 uppercase">System</h3>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/users" ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                  asChild
                >
                  <Link href="/users">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Users</span>
                  </Link>
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    pathname === "/settings" ? "text-blue-400 font-semibold" : "text-slate-400"
                  }`}
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-3" />
                    <span>Settings</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-white">
            <LogOut className="w-4 h-4 mr-3" />
            <span>Log Out</span>
          </Button>
        </div>
      </div>
    </>
  );
}
