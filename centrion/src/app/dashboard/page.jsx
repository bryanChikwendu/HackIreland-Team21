"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraFeed } from "@/components/camera-feed";
import { mockCameras, mockAlerts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, AlertTriangle, Activity, CheckCircle2, Clock, User } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Load saved cameras from localStorage & append them to mockCameras
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Retrieve stored cameras from localStorage
      const storedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
      
      // Combine mockCameras with storedCameras
      const combinedCameras = [...mockCameras, ...storedCameras];

      // Set state with combined list
      setCameras(combinedCameras);

      // Set the first available camera as the default selected
      setSelectedCamera(searchParams.get("camera") || combinedCameras[0]?.id);
    }
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      // Filter active alerts for the selected camera
      const currentAlerts = mockAlerts.filter(
        (alert) => alert.status === "active" && alert.cameraId === selectedCamera
      );
      setActiveAlerts(currentAlerts);
    }
  }, [selectedCamera]);

  const selectedCameraData = cameras.find((cam) => cam.id === selectedCamera);

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Selected Camera Feed */}
      {selectedCameraData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedCameraData?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedCameraData?.location}</p>
            </div>
            <Badge variant={selectedCameraData?.status === "active" ? "default" : "destructive"}>
              {selectedCameraData?.status === "active" ? "Live" : "Offline"}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-video rounded-lg overflow-hidden">
              <CameraFeed cameraId={selectedCamera} streamUrl={selectedCameraData?.streamUrl} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Camera List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <Card
            key={camera.id}
            className={`cursor-pointer transition duration-200 ease-in-out ${
              selectedCamera === camera.id ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-slate-300"
            }`}
            onClick={() => {
              setSelectedCamera(camera.id);
              router.push(`/dashboard?camera=${camera.id}`);
            }}
          >
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <CameraFeed cameraId={camera.id} streamUrl={camera.streamUrl} />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{camera.name}</CardTitle>
              <CardDescription>{camera.location}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Alert Detail Modal */}
      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              {new Date(selectedAlert?.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alert Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Detection Type</h3>
                <Badge variant="outline" className="text-base">
                  {selectedAlert?.detectionType}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Context</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAlert?.context}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Confidence Score</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${selectedAlert?.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(selectedAlert?.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Alert Image and Actions */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Detection Frame</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {selectedAlert?.imageUrl && (
                    <img 
                      src={selectedAlert.imageUrl} 
                      alt="Alert detection frame"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action History */}
          <div>
            <h3 className="font-semibold mb-3">Action History</h3>
            <ScrollArea className="h-[200px]">
              <div className="space-y-3">
              {mockAlerts.map((action, index) => (
                <div 
                  key={action?.id || index} // Ensure a unique key even if ID is missing
                  className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="rounded-full p-2 bg-background">
                    {action?.type?.includes('Created') && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    {action?.type?.includes('Acknowledged') && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                    {action?.type?.includes('Dispatched') && <User className="h-4 w-4 text-purple-600" />}
                    {action?.type?.includes('Assessed') && <Activity className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{action?.type || "Unknown Action"}</p>
                        <p className="text-xs text-muted-foreground">By {action?.user || "Unknown User"}</p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {action?.timestamp ? new Date(action.timestamp).toLocaleTimeString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsAlertModalOpen(false)}>
              Close
            </Button>
            <Button>
              Take Action
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
