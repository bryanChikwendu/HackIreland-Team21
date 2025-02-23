"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { mockLocations } from "@/lib/mock-data";

const MapComponent = dynamic(() => import("@/components/map-component").then((mod) => mod.default), { ssr: false });

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState(mockLocations);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Location Map</h3>
      </div>
      <div className="h-[600px] bg-slate-100">
        <MapComponent locations={locations} onLocationClick={handleLocationClick} />
      </div>
    </div>
  );
}
