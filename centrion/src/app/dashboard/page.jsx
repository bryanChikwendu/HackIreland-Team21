

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebSocketClient } from "@/lib/websocket-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraFeed } from "@/components/camera-feed";
import VideoFeed from '@/components/video-feed';
import EventStream from "@/components/event-stream";
import { mockCameras, mockLocations, mockAlerts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertPanel } from "@/components/alert-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, AlertTriangle, Activity, CheckCircle2, Clock, User } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyCYxC2hCbFC4ZfJXp-QwfZOYSQM_fgBx5I";

  // State management
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [client, setClient] = useState<WebSocketClient | null>(null);
  const [client, setClient] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  


  // Load cameras from localStorage and combine with mock data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
      const combinedCameras = [...mockCameras, ...storedCameras];
      setCameras(combinedCameras);
      setSelectedCamera(searchParams.get("camera") || combinedCameras[0]?.id);
    }
  }, []);

  // Initialize websocket client
  useEffect(() => {
    const wsClient = new WebSocketClient(API_KEY);

    wsClient.on("open", () => {
      setIsConnected(true);
      setIsLoading(false);
    });

    wsClient.on("close", () => {
      setIsConnected(false);
      setIsLoading(false);
    });

    wsClient.on("error", (error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    });

    setClient(wsClient);

    return () => {
      wsClient.disconnect();
    };
  }, [API_KEY]);

  // Update active alerts when camera changes
  useEffect(() => {
    if (selectedCamera) {
      const currentAlerts = mockAlerts.filter(
        (alert) => alert.status === "active" && alert.cameraId === selectedCamera
      );
      setActiveAlerts(currentAlerts);
    }
  }, [selectedCamera]);

  // Connect/Disconnect handlers
  const handleConnect = async () => {
    if (!client) return;
    try {
      setIsLoading(true);
      await client.connect();
    } catch (error) {
      console.error("Failed to connect:", error);
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (!client) return;
    client.disconnect();
  };

  const selectedCameraData = cameras.find((cam) => cam.id === selectedCamera);

  return (
    <Tabs defaultValue="cameras" className="h-full flex flex-col p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
      </div>

      {/* Cameras Tab */}
      {/* <TabsContent value="cameras" className="flex-1">
        <div className="space-y-8"> */}
          {/* Main Camera Feed */}
          {selectedCameraData && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">{selectedCameraData?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedCameraData?.location}</p>
                </div>
                <Badge variant={selectedCameraData?.status === "active" ? "default" : "destructive"}>
                  {selectedCameraData?.status === "active" ? "Live" : "Offline"}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                  {/* {client && (
                    <CameraFeed
                      cameraId={selectedCamera}
                      streamUrl={selectedCameraData?.streamUrl}
                      websocketClient={client}
                      isConnected={isConnected}
                    />
                  )} */}
                {client && (
                  <VideoFeed
                    cameraId={selectedCamera}
                    streamUrl={selectedCameraData?.streamUrl}
                    websocketClient={client}
                    isConnected={isConnected}
                    isMainFeed={true}
                  />
                )}
                </div>
                <div className="mt-4 flex justify-center gap-4 p-4">
                  {!isConnected ? (
                    <Button
                      onClick={handleConnect}
                      disabled={isLoading}
                      className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                    >
                      {isLoading ? "Connecting..." : "Start Event Monitoring"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDisconnect}
                      variant="destructive"
                    >
                      Stop Event Monitoring
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

      
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle>AI Detection Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
                {client &&  (
              <EventStream
                websocketClient={client}
                isConnected={isConnected}
              />
                )}
            </div>
          </CardContent>
        </Card>
      

      {/* Camera List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          <Card
            key={camera.id}
            className={`cursor-pointer transition duration-200 ease-in-out border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
              selectedCamera === camera.id ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-slate-300"
            }`}
            onClick={() => {
              setSelectedCamera(camera.id);
              router.push(`/dashboard?camera=${camera.id}`);
            }}
          >
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                <VideoFeed cameraId={camera.id} streamUrl={camera.streamUrl} />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{camera.name}</CardTitle>
              <CardDescription className="dark:text-gray-400">{camera.location}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Alert Detail Modal */}
      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              {new Date(selectedAlert?.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alert Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Detection Type</h3>
                <Badge variant="outline" className="text-base border border-gray-200 dark:border-gray-600">
                  {selectedAlert?.detectionType}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Context</h3>
                <p className="text-sm text-muted-foreground dark:text-gray-300">
                  {selectedAlert?.context}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Confidence Score</h3>
                <div className="flex items-center space-x-2">
                  <div className="h-2 flex-1 bg-muted dark:bg-gray-700 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
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
                <div className="aspect-video rounded-lg overflow-hidden bg-muted dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
            <ScrollArea className="h-[200px] border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {mockAlerts.map((action, index) => (
                  <div 
                    key={action?.id || index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm dark:text-gray-300">{action?.type || "Unknown Action"}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" className="dark:text-white border border-gray-200 dark:border-gray-700" onClick={() => setIsAlertModalOpen(false)}>
              Close
            </Button>
            <Button>Take Action</Button>
          </div>
        </DialogContent>
      </Dialog>
      </Tabs>
  );
}