"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockLocations } from "@/lib/mock-data";

// Dynamically import map component with SSR disabled
const MapComponent = dynamic(() => import("@/components/map-component").then((mod) => mod.default), { ssr: false });

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState(mockLocations);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load theme from localStorage
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);

      // Load stored cameras from localStorage and format them for map
      const storedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
      const formattedCameras = storedCameras.map((cam) => ({
        id: cam.id,
        name: cam.name,
        lat: parseFloat(cam.lat),
        lng: parseFloat(cam.lng),
        cameraId: cam.id, 
      }));

      setLocations([...mockLocations, ...formattedCameras]);
    }
  }, []);

  const handleLocationClick = (cameraId) => {
    if (cameraId) {
      router.push(`/dashboard?camera=${cameraId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden h-full">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-white">Location Map</h3>
      </div>

      {/* Map Container */}
      <div className="h-[600px] bg-gray-100 dark:bg-gray-800">
        <MapComponent locations={locations} onLocationClick={handleLocationClick} theme={theme} />
      </div>
    </div>
  );
}
