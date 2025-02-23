// File: lib/mock-data.js
// Mock data for the Centrion dashboard

export let mockCameras = [
  { 
    id: 'test-camera', 
    name: 'Web camera', 
    location: 'Here',
    type: 'Webcam',
    status: 'active' 
  },
  { 
    id: 'dublin-city', 
    name: 'Dublin City', 
    location: 'O\'Connell Street',
    status: 'active',
    type: 'Security Camera',
    streamUrl: 'https://media.evercam.io/live/Z3BvY2FtfEdQT0NhbQ==/index.m3u8?stream_token=i94B7mV5ZDf6HgXdWxqrEGD4uolWdYvL_ARPEDnGCCjyzi2VzvEObT9yAozOAzoXuHHsYP1P3kv5Dm5eCyi0WSa9fcSst4r8_wm2Hf0GZPkk5zbMy09GY5eU-9kGaQXjRNPjXhlCtLeYMQGc4puYlw=='
  },
  { 
    id: 'bay', 
    name: 'Bay', 
    location: 'Dublin Bay',
    status: 'active',
    type: 'Security Camera',
    streamUrl: 'https://s14.ipcamlive.com/streams/0etsvhlzep3ncaekw/stream.m3u8'
  },
]

export const mockLocations = [
  { cameraId: 'test-camera', name: 'Web camera', lat: 53.3490173, lng: -6.2529201 },
  { cameraId: 'dublin-city', name: 'Dublin City', lat: 53.349805, lng: -6.260309 },
  { cameraId: 'bay', name: 'Bay', lat: 53.3032783, lng: -6.1334416 },
]

export const mockAlerts = [
  { 
    id: 'alert-1', 
    cameraId: 'test-camera', 
    timestamp: new Date().getTime() - 1000 * 60 * 5, 
    detectionType: 'Weapon and Hands Up', 
    confidence: 0.92, 
    status: 'active',
    context: "Person appears to be holding an object resembling a handgun, pointing it at someone behind the counter. Second individual has hands raised above shoulders in defensive posture.",
    imageUrl: "/alert-1.png"
  },
  { 
    id: 'alert-2', 
    cameraId: 'dublin-city', 
    timestamp: new Date().getTime() - 1000 * 60 * 30, 
    detectionType: 'Unusual Movement', 
    confidence: 0.76, 
    status: 'resolved',
    context: "Person exhibiting erratic movements, pacing quickly near entrance. No weapons visible, but behavior appears agitated.",
    imageUrl: "/alert-2.png"
  }
]

  