"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const L = typeof window !== "undefined" ? require("leaflet") : null;

function MapComponent({ locations }) {
  const router = useRouter();

  const [cameraIcon, setCameraIcon] = useState(
    L
      ? new L.Icon({
          iconUrl: "/cctv.png",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })
      : null
  );

  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      setCameraIcon(
        new L.Icon({
          iconUrl: "/cctv.png",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })
      );
    }
  }, []);

  const handleLocationClick = useCallback(
    (cameraId) => {
      if (cameraId) {
        router.push(`/dashboard?camera=${cameraId}`);
      }
    },
    [router]
  );

  if (!cameraIcon) return <div className="text-center p-4">Loading map...</div>;

  return (
    <MapContainer
      center={[53.3498, -6.2603]} // Default to Dublin
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg shadow"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((loc, index) => (
        <Marker
          key={loc.id || index} // ✅ Ensure each key is unique
          position={[loc.lat, loc.lng]}
          icon={cameraIcon}
          eventHandlers={{
            click: () => handleLocationClick(loc.cameraId),
          }}
        >
          {/* Always Visible Camera Name */}
          <Tooltip direction="top" offset={[0, -25]} opacity={1} permanent>
            <span
              className="cursor-pointer text-blue-500 font-bold hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLocationClick(loc.cameraId);
              }}
            >
              {loc.name}
            </span>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
