"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Lazy load ReactPlayer to prevent SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function CameraFeed({ cameraId, streamUrl }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(null); // Ensure it's `null` initially

  useEffect(() => {
    // Ensure date is only set on client-side
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cameraId === "test-camera") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("Error accessing camera:", error));

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [cameraId]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {cameraId === "test-camera" ? (
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      ) : streamUrl ? (
        <ReactPlayer url={streamUrl} playing controls width="100%" height="100%" muted />
      ) : (
        <div className="text-white">No stream available</div>
      )}

      {/* Camera ID and Timestamp (Only rendered after hydration) */}
      {currentTime && (
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded-sm">
          <div>ID: {cameraId}</div>
          <div>{currentTime}</div>
        </div>
      )}
    </div>
  );
}
