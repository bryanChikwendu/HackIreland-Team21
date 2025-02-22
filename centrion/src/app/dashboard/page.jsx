'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CameraFeed } from '@/components/camera-feed';
import { mockCameras, mockAlerts } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Camera, 
  AlertTriangle, 
  Activity, 
  Users, 
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  User
} from 'lucide-react';

// Mock action history data
const mockActionHistory = [
  { id: 1, type: 'Alert Created', user: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 2, type: 'Alert Acknowledged', user: 'John Doe', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
  { id: 3, type: 'Security Dispatched', user: 'Sarah Smith', timestamp: new Date(Date.now() - 1000 * 60 * 3) },
  { id: 4, type: 'Situation Assessed', user: 'Mike Johnson', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCamera, setSelectedCamera] = useState(searchParams.get('camera') || mockCameras[0]?.id);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  useEffect(() => {
    // Filter active alerts for the selected camera
    const currentAlerts = mockAlerts.filter(
      alert => alert.status === 'active' && alert.cameraId === selectedCamera
    );
    setActiveAlerts(currentAlerts);
  }, [selectedCamera]);

  const selectedCameraData = mockCameras.find(cam => cam.id === selectedCamera);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header Stats */}
        {/* ... (previous stats code remains the same) ... */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Primary Feed and Alerts */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Camera Feed */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{selectedCameraData?.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedCameraData?.location}</p>
                </div>
                <Badge variant={selectedCameraData?.status === 'active' ? 'default' : 'destructive'}>
                  {selectedCameraData?.status === 'active' ? 'Live' : 'Offline'}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <CameraFeed
                    cameraId={selectedCamera}
                    streamUrl={selectedCameraData?.streamUrl}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Camera Alerts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Camera Alerts</CardTitle>
                  <CardDescription>Showing {activeAlerts.length} active alerts</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/alerts')}>
                  View All Alerts
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {activeAlerts.map(alert => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-4 p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => handleAlertClick(alert)}
                      >
                        <div className="rounded-full p-2 bg-red-100 shrink-0">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{alert.detectionType}</p>
                            <Badge variant="outline">{Math.round(alert.confidence * 100)}% confidence</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{alert.context}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                    {activeAlerts.length === 0 && (
                      <div className="text-center py-8">
                        <div className="rounded-full bg-green-100 p-3 w-fit mx-auto">
                          <Activity className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="mt-4 text-sm font-medium">All Clear</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          No active alerts for this camera
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Secondary Feeds */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Secondary Feeds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCameras.filter(cam => cam.id !== selectedCamera).slice(0, 4).map(camera => (
                  <div
                    key={camera.id}
                    className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedCamera(camera.id);
                      router.push(`/dashboard?camera=${camera.id}`);
                    }}
                  >
                    <CameraFeed
                      cameraId={camera.id}
                      streamUrl={camera.streamUrl}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        Switch to Feed
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <span className="text-xs text-white font-medium">{camera.name}</span>
                      <Badge
                        variant={camera.status === 'active' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {camera.status === 'active' ? 'Live' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
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
                {mockActionHistory.map((action, index) => (
                  <div 
                    key={action.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="rounded-full p-2 bg-background">
                      {action.type.includes('Created') && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {action.type.includes('Acknowledged') && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                      {action.type.includes('Dispatched') && <User className="h-4 w-4 text-purple-600" />}
                      {action.type.includes('Assessed') && <Activity className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{action.type}</p>
                          <p className="text-xs text-muted-foreground">By {action.user}</p>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {action.timestamp.toLocaleTimeString()}
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
    </>
  );
}