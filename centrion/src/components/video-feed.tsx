
import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoFeedProps {
  websocketClient?: {
    sendVideoFrame: (base64Image: string) => void;
    isConnected: () => boolean;
  };
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("active");
  const frameRequestRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const targetFpsInterval = 1000 / 2; // 2 FPS

  const processVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isStreaming || !isConnected || !isMainFeed || !websocketClient) {
      return;
    }

    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;

    if (elapsed >= targetFpsInterval) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Scale down video by 75% for better performance
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Compress with 70% JPEG quality
      const base64Data = canvas.toDataURL('image/jpeg', 0.7);
      const base64Image = base64Data.split(',')[1];

      // Send through WebSocket with proper format
      websocketClient.sendVideoFrame(base64Image);

      lastFrameTimeRef.current = now;
    }

    frameRequestRef.current = requestAnimationFrame(processVideoFrame);
  }, [isStreaming, isConnected, isMainFeed, websocketClient]);

  // Initialize video stream
  useEffect(() => {
    setError(null);
    setStatus("active");

    const initializeStream = async () => {
      if (cameraId === "test-camera") {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            }
          });

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }

          setStream(mediaStream);
          setIsStreaming(true);
          setStatus("active");
        } catch (err) {
          console.error('Error accessing webcam:', err);
          setError("No Connection");
          setStatus("offline");
        }
      } else if (!streamUrl) {
        setStatus("offline");
        setError("No Stream Available");
      }
    };

    initializeStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsStreaming(false);
      }
    };
  }, [cameraId, streamUrl]);

  // Handle frame processing
  useEffect(() => {
    if (isStreaming && isConnected && isMainFeed && websocketClient) {
      frameRequestRef.current = requestAnimationFrame(processVideoFrame);
    }

    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [isStreaming, isConnected, websocketClient, isMainFeed, processVideoFrame]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
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