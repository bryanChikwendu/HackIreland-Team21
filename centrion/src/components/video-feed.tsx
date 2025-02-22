"use client";

import React, { useRef, useEffect, useState } from 'react';
import { captureVideoFrame } from '@/lib/utils';
import { WebSocketClient } from '@/lib/websocket-client';

interface VideoFeedProps {
  websocketClient: WebSocketClient;
  isConnected: boolean;
}

// Changed to default export
export default function VideoFeed({ websocketClient, isConnected }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Start webcam
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
      return mediaStream;
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
    }
  };

  // Toggle webcam
  const toggleWebcam = async () => {
    if (isStreaming) {
      stopWebcam();
    } else {
      await startWebcam();
    }
  };

  // Send video frames when connected
  useEffect(() => {
    let frameInterval: NodeJS.Timeout | null = null;
    
    const sendVideoFrame = async () => {
      if (videoRef.current && isStreaming && isConnected) {
        const base64Image = await captureVideoFrame(videoRef.current);
        if (base64Image) {
          websocketClient.sendVideoFrame(base64Image);
        }
      }
    };
    
    if (isStreaming && isConnected) {
      // Send frames at 2fps (every 500ms)
      frameInterval = setInterval(sendVideoFrame, 500);
    }
    
    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [isStreaming, isConnected, websocketClient]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="rounded-lg overflow-hidden border border-gray-300 bg-black relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-[480px]"
        />
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <p>Camera off</p>
          </div>
        )}
      </div>
      
      <button
        onClick={toggleWebcam}
        className="absolute bottom-6 right-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        {isStreaming ? (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
            Turn Off
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M23 7l-7 5 7 5V7z"></path>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            Turn On
          </span>
        )}
      </button>
    </div>
  );
}