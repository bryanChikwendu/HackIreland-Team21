"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockAlerts, mockCameras } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

const formatDate = (timestamp) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
};

export default function AlertsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleResolveAlert = (alertId) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Security Alerts</h1>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
              <th className="p-3 text-left font-medium">Time</th>
              <th className="p-3 text-left font-medium">Camera</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Confidence</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-b hover:bg-gray-50 dark:border-gray-700 hover:dark:bg-gray-700 transition duration-200"
              >
                <td className="p-3 text-sm">{formatDate(alert.timestamp)}</td>
                <td
                  className="p-3 text-sm font-medium cursor-pointer text-blue-500 hover:underline"
                  onClick={() => router.push(`/dashboard?camera=${alert.cameraId}`)}
                >
                  {mockCameras.find((c) => c.id === alert.cameraId)?.name || "Unknown"}
                </td>
                <td className="p-3 text-sm">{alert.detectionType}</td>
                <td className="p-3 text-sm">{Math.round(alert.confidence * 100)}%</td>
                <td className="p-3 text-sm">
                  <Badge variant={alert.status === "active" ? "destructive" : "outline"}>
                    {alert.status === "active" ? "Active" : "Resolved"}
                  </Badge>
                </td>
                <td className="p-3 text-sm">
                  {alert.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm dark:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleResolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {alerts.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
