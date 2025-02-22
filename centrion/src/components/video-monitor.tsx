import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Video, VideoOff } from 'lucide-react';
import type { VideoMonitorProps } from '@/lib/types';

const VideoMonitor: React.FC<VideoMonitorProps> = ({
  isConnected,
  onConnect,
  onVideoFrame,
  parameters,
  onUpdateParameters,
  alerts,
  onUpdateAlerts
}) => {
  const [newParameter, setNewParameter] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start webcam
  // Frame capture interval ref
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsStreaming(true);

      // Start frame capture loop
      frameIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || !isConnected) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Get base64 image without the data:image/jpeg;base64, prefix
        const base64Data = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        console.log('Sending video frame for analysis');
        onVideoFrame(base64Data);
      }, 1000); // Capture every second
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      // Clear frame capture interval
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
    }
  };

  // Add new monitoring parameter
  const addParameter = () => {
    if (!newParameter.trim()) return;

    const parameter = {
      id: Math.random().toString(36).substring(2),
      instruction: newParameter.trim(),
      isActive: true,
      createdAt: new Date()
    };

    onUpdateParameters([...parameters, parameter]);
    setNewParameter('');
  };

  // Remove parameter
  const removeParameter = (id: string) => {
    onUpdateParameters(parameters.filter(p => p.id !== id));
  };

  // Toggle parameter active state
  const toggleParameter = (id: string) => {
    onUpdateParameters(parameters.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // Mark alert as read
  const markAlertRead = (id: string) => {
    onUpdateAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 h-screen">
      {/* Video Feed Section */}
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Video Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full"
              />
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                  <p>Camera off</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={isStreaming ? stopWebcam : startWebcam}
                variant={isStreaming ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isStreaming ? (
                  <>
                    <VideoOff className="w-4 h-4" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Start Camera
                  </>
                )}
              </Button>
              <Button
                onClick={onConnect}
                variant={isConnected ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                <div className="relative flex h-3 w-3">
                  <span className={`absolute inline-flex h-full w-full rounded-full ${
                    isConnected ? 'bg-green-400' : 'bg-gray-400'
                  } ${isConnected ? 'animate-ping opacity-75' : ''}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    isConnected ? 'bg-green-500' : 'bg-gray-500'
                  }`}></span>
                </div>
                {isConnected ? 'Disconnect AI' : 'Connect AI'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parameters and Alerts Section */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        {/* Parameters Card */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={newParameter}
                onChange={(e) => setNewParameter(e.target.value)}
                placeholder="Enter monitoring instruction..."
                onKeyDown={(e) => e.key === 'Enter' && addParameter()}
              />
              <Button onClick={addParameter}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {parameters.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <span className={param.isActive ? 'text-black' : 'text-gray-400'}>
                    {param.instruction}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleParameter(param.id)}
                    >
                      {param.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParameter(param.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${
                    alert.read ? 'bg-gray-100' : 'bg-blue-50'
                  }`}
                  onClick={() => markAlertRead(alert.id)}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm">{alert.message}</p>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No alerts yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoMonitor;