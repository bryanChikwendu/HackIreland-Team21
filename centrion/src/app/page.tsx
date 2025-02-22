"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraFeed } from "@/components/camera-feed";
import { mockCameras, mockLocations } from "@/lib/mock-data";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <Tabs defaultValue="cameras" className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="cameras">Cameras</TabsTrigger>
          <TabsTrigger value="locations" onClick={() => router.push("/locations")}>
            Locations
          </TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
      </div>

      {/* Cameras Tab */}
      <TabsContent value="cameras" className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCameras.map((camera) => (
            <CameraFeed key={camera.id} cameraId={camera.id} streamUrl={camera.streamUrl} />
          ))}
        </div>
      </TabsContent>

      {/* Alerts Tab */}
      <TabsContent value="alerts" className="flex-1">
        <p>Alerts content goes here...</p>
      </TabsContent>
    </Tabs>
  );
}
