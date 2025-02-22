"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { mockLocations } from "@/lib/mock-data";

// ✅ Lazy load MapComponent to prevent SSR issues
const MapComponent = dynamic(() => import("@/components/map-component").then((mod) => mod.default), { ssr: false });

export default function LocationsPage() {
  const router = useRouter();

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
        <MapComponent locations={mockLocations} onLocationClick={handleLocationClick} />
      </div>
    </div>
  );
}
