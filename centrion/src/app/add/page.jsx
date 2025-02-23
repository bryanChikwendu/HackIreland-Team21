"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

export default function AddCameraPage() {
  const router = useRouter();
  
  // Load cameras from localStorage or set default empty array
  const [cameras, setCameras] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cameras")) || [];
    }
    return [];
  });

  const [camera, setCamera] = useState({
    id: `camera-${Date.now()}`,
    name: "",
    type: "Webcam",
    location: "",
    lat: "",
    lng: "",
    streamUrl: "",
    status: "active",
  });

  const cameraTypes = ["Webcam", "Security Camera", "CCTV", "IP Camera"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cameras", JSON.stringify(cameras));
    }
  }, [cameras]);

  const handleChange = (e) => {
    setCamera({
      ...camera,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!camera.name || !camera.location || !camera.streamUrl || !camera.lat || !camera.lng) {
      alert("Please fill in all fields!");
      return;
    }

    const updatedCameras = [...cameras, camera];
    setCameras(updatedCameras);
    localStorage.setItem("cameras", JSON.stringify(updatedCameras));

    console.log("New Camera Added:", camera);
    alert("Camera added successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Camera className="w-6 h-6 mr-2" />
        Add New Camera
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Camera Name</label>
          <Input
            type="text"
            name="name"
            value={camera.name}
            onChange={handleChange}
            required
            placeholder="Enter camera name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Camera Type</label>
          <select
            name="type"
            value={camera.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            {cameraTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input
            type="text"
            name="location"
            value={camera.location}
            onChange={handleChange}
            required
            placeholder="Enter location name"
          />
        </div>

        {/* Latitude & Longitude Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <Input
              type="number"
              name="lat"
              value={camera.lat}
              onChange={handleChange}
              required
              step="any"
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <Input
              type="number"
              name="lng"
              value={camera.lng}
              onChange={handleChange}
              required
              step="any"
              placeholder="Enter longitude"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Stream URL</label>
          <Input
            type="text"
            name="streamUrl"
            value={camera.streamUrl}
            onChange={handleChange}
            required
            placeholder="Enter RTSP/HTTP stream URL"
          />
        </div>

        <Button type="submit" className="w-full">
          Add Camera
        </Button>
      </form>
    </div>
  );
}
