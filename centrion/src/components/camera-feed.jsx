"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Lazy load ReactPlayer to prevent SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function CameraFeed({ cameraId, streamUrl }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("active");

  useEffect(() => {
    setError(null);
    setStatus("active");

    if (cameraId === "test-camera") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStatus("active");
          }
        })
        .catch((error) => {
          console.error("Webcam access error:", error);
          setError("No Connection");
          setStatus("offline");
        });

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    } else if (!streamUrl) {
      setStatus("offline");
      setError("No Stream Available");
    }
  }, [cameraId, streamUrl]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {error ? (
        <div className="text-white text-sm">{error}</div>
      ) : cameraId === "test-camera" ? (
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
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

      {currentTime && (
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded-sm">
          <div>ID: {cameraId}</div>
          <div>{currentTime}</div>
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-full">
        <span className={`h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
        <span>{status === "active" ? "Live" : "Offline"}</span>
      </div>
    </div>
  );
}
