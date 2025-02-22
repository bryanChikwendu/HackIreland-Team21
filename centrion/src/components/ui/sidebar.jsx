"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Import usePathname to get the current route
import { Camera, Map, AlertTriangle, Users, Settings, Shield, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ Get the current URL path

  return (
    <div
      className={`bg-slate-900 text-white w-64 flex-shrink-0 fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform duration-200 ease-in-out ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-400" />
          <span className="text-lg font-semibold">Centrion</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(false)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
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

      {/* Logout */}
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
        <Button variant="ghost" className="w-full justify-start text-white">
          <LogOut className="w-4 h-4 mr-3" />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}
