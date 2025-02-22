"use client"

import { useEffect, useRef } from "react"
import ReactPlayer from "react-player"

export function CameraFeed({ cameraId, streamUrl }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (cameraId === "test-camera") {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((error) => console.error("Error accessing camera:", error))

      return () => {
        if (videoRef.current?.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [cameraId])

  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {cameraId === "test-camera" ? (
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      ) : streamUrl ? (
        <ReactPlayer url={streamUrl} playing controls width="100%" height="100%" />
      ) : (
        <div className="text-white">No stream available</div>
      )}

      {/* Camera ID and Timestamp */}
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded-sm">
        <div>ID: {cameraId}</div>
        <div>{new Date().toLocaleString()}</div>
      </div>
    </div>
  )
}
