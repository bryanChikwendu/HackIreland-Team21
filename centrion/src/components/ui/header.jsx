"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Settings, Menu, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { mockAlerts, mockCameras } from "@/lib/mock-data";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const filteredAlerts = mockAlerts.filter((alert) => alert.status === "active");
    setActiveAlerts(filteredAlerts);
  }, []);

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(true)}>
        <Menu className="h-6 w-6" />
      </Button>

      <h1 className="text-xl font-semibold hidden lg:block">Security Dashboard</h1>

      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-white shadow-lg rounded-md border border-gray-200" // ✅ Fix: Background & Shadow
          >
            <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeAlerts.length > 0 ? (
              activeAlerts.slice(0, 5).map((alert) => (
                <DropdownMenuItem
                  key={alert.id}
                  className="cursor-pointer py-2 flex items-start space-x-2 hover:bg-gray-100" // ✅ Fix: Hover effect
                  onClick={() => router.push(`/dashboard?camera=${alert.cameraId}`)}
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{alert.detectionType}</div>
                    <div className="text-sm text-gray-500">
                      {mockCameras.find((c) => c.id === alert.cameraId)?.name} • {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">No active alerts</div>
            )}
            {activeAlerts.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center font-medium text-blue-500 hover:underline"
                  onClick={() => router.push("/alerts")}
                >
                  View all alerts
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings Button */}
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
