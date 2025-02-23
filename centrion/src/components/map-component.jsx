"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const L = typeof window !== "undefined" ? require("leaflet") : null;

function MapComponent({ locations }) {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [cameraIcon, setCameraIcon] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleThemeChange = () => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
      };

      window.addEventListener("storage", handleThemeChange);
      handleThemeChange(); // Apply the saved theme on mount

      return () => window.removeEventListener("storage", handleThemeChange);
    }
  }, []);

  // ✅ Update Camera Icon when Theme Changes
  useEffect(() => {
    if (L) {
      setCameraIcon(
        new L.Icon({
          iconUrl: theme === "dark" ? "/white_cctv.png" : "/cctv.png",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })
      );
    }
  }, [theme]); // ✅ Re-run effect when theme changes

  const handleLocationClick = useCallback(
    (cameraId) => {
      if (cameraId) {
        router.push(`/dashboard?camera=${cameraId}`);
      }
    },
    [router]
  );

  if (!L || !cameraIcon) return <div className="text-center p-4">Loading map...</div>;

  return (
    <MapContainer
      center={[53.3498, -6.2603]} // Default center
      zoom={13}
      key={theme} // ✅ Forces re-render when theme changes
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      className="rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      {/* Dynamic Tile Layer for Dark & Light Mode */}
      <TileLayer
        url={
          theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
      />

      {/* Camera Markers */}
      {locations.map((loc, index) => (
        <Marker
          key={loc.id || index}
          position={[loc.lat, loc.lng]}
          icon={cameraIcon}
          eventHandlers={{
            click: () => handleLocationClick(loc.cameraId),
          }}
        >
          {/* Always Visible Camera Name */}
          <Tooltip direction="top" offset={[0, -25]} opacity={1} permanent>
            <span
              className="cursor-pointer text-blue-500 dark:text-blue-300 font-bold hover:underline "
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
