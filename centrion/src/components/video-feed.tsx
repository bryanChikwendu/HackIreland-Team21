
import React, { useRef, useEffect, useState } from 'react';
import { captureVideoFrame } from '@/lib/utils';
import { WebSocketClient } from '@/lib/websocket-client';
import dynamic from "next/dynamic";

// Lazy load ReactPlayer to prevent SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoFeedProps {
  websocketClient?: WebSocketClient;
  isConnected?: boolean;
  isMainFeed?: boolean;
  cameraId?: string;
  streamUrl?: string;
}

const VideoFeed = ({ 
  websocketClient, 
  isConnected = false, 
  isMainFeed = false,
  cameraId,
  streamUrl
}: VideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("active");

  // Initialize webcam
  useEffect(() => {
    setError(null);
    setStatus("active");

    if (cameraId === "test-camera") {
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
          setStatus("active");
        } catch (error) {
          console.error('Error accessing webcam:', error);
          setError("No Connection");
          setStatus("offline");
        }
      };

      startWebcam();

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          setIsStreaming(false);
        }
      };
    } else if (!streamUrl) {
      setStatus("offline");
      setError("No Stream Available");
    }
  }, [cameraId, streamUrl]);

  // Send video frames when connected
  useEffect(() => {
    let frameInterval: NodeJS.Timeout | null = null;
    
    const sendVideoFrame = async () => {
      if (videoRef.current && isStreaming && isConnected && isMainFeed && websocketClient) {
        const base64Image = await captureVideoFrame(videoRef.current);
        if (base64Image) {
          websocketClient.sendVideoFrame(base64Image);
        }
      }
    };
    
    if (isStreaming && isConnected && isMainFeed && websocketClient) {
      // Send frames at 2fps (every 500ms)
      frameInterval = setInterval(sendVideoFrame, 500);
    }
    
    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isStreaming, isConnected, websocketClient, isMainFeed]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {error ? (
        <div className="text-white text-sm">{error}</div>
      ) : cameraId === "test-camera" ? (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover" 
        />
      ) : streamUrl ? (
        <ReactPlayer
          url={streamUrl}
          playing
          controls
          width="100%"
          height="100%"
          muted
          onError={() => {
            setStatus("offline");
            setError("No Stream Available");
          }}
        />
      ) : (
        <div className="text-white text-sm">No Stream Available</div>
      )}

      <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-full">
        <span className={`h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
        <span>{status === "active" ? "Live" : "Offline"}</span>
      </div>
    </div>
  );
};

export default VideoFeed;