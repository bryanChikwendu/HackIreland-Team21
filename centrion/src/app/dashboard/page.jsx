"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraFeed } from "@/components/camera-feed";
import { mockCameras, mockAlerts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Maximize, ChevronDown, ChevronUp } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cameraQuery = searchParams.get("camera");

  const [cameras, setCameras] = useState(mockCameras);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const fullscreenRef = useRef(null);

  // ✅ Group cameras by type
  const categorizedCameras = cameras.reduce((acc, camera) => {
    if (!acc[camera.type]) acc[camera.type] = [];
    acc[camera.type].push(camera);
    return acc;
  }, {});

  // ✅ State to track expanded/collapsed categories
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(categorizedCameras).reduce((acc, type) => {
      acc[type] = true; // Default: expanded
      return acc;
    }, {})
  );

  useEffect(() => {
    if (cameraQuery && cameras.some((cam) => cam.id === cameraQuery)) {
      setSelectedCamera(cameraQuery);
    } else if (!selectedCamera && cameras.length > 0) {
      setSelectedCamera(cameras[0].id);
    }
  }, [cameraQuery, cameras, selectedCamera]);

  const handleFullscreen = () => {
    if (fullscreenRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        fullscreenRef.current.requestFullscreen();
      }
    }
  };

  const toggleCategory = (type) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Live Camera Feeds</h1>

      {/* Selected Camera View */}
      {selectedCamera && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-lg">{cameras.find((c) => c.id === selectedCamera)?.name}</h3>
            <Button variant="outline" size="sm" onClick={handleFullscreen}>
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x">
            <div className="lg:col-span-2" ref={fullscreenRef}>
              <div className="aspect-video bg-slate-200 relative">
                <CameraFeed
                  cameraId={selectedCamera}
                  fullView={true}
                  streamUrl={cameras.find((c) => c.id === selectedCamera)?.streamUrl}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Categories */}
      {Object.entries(categorizedCameras).map(([type, cameras]) => (
        <div key={type} className="mb-4 bg-white rounded-lg shadow">
          {/* Category Header */}
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-t-lg"
            onClick={() => toggleCategory(type)}
          >
            <span className="text-lg font-semibold">
              {type} ({cameras.length})
            </span>
            {expandedCategories[type] ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>

          {/* Camera Grid (Only Show When Expanded) */}
          {expandedCategories[type] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition duration-200 ease-in-out ${
                    selectedCamera === camera.id ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-slate-300"
                  }`}
                  onClick={() => {
                    router.push("/dashboard?camera=" + camera.id);
                    setSelectedCamera(camera.id);
                  }}
                >
                  <div className="relative aspect-video bg-slate-200">
                    <CameraFeed cameraId={camera.id} streamUrl={camera.streamUrl} />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{camera.name}</h3>
                    <p className="text-sm text-slate-500">{camera.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
