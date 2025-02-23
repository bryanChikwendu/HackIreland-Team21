import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines class names with tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique ID for messages
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Capture webcam frame and convert to base64
export async function captureVideoFrame(videoElement: HTMLVideoElement): Promise<string | null> {
  if (!videoElement || !videoElement.videoWidth) {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth * 0.25; // Reduce size for performance
  canvas.height = videoElement.videoHeight * 0.25;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Get base64 image without the data:image/jpeg;base64, prefix
  const base64Data = canvas.toDataURL('image/jpeg', 0.7);
  return base64Data.split(',')[1]; // Remove the prefix
}