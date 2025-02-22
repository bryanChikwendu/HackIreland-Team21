"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";

export default function AddCameraPage() {
  const router = useRouter();
  const [camera, setCamera] = useState({
    name: "",
    type: "Webcam",
    location: "",
    streamUrl: "",
  });

  const cameraTypes = ["Webcam", "Security Camera", "CCTV", "IP Camera"];

  const handleChange = (e) => {
    setCamera({
      ...camera,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New Camera:", camera);

    // 🚀 TODO: Replace this with an API call to store the camera in the database
    // Example: fetch("/api/cameras", { method: "POST", body: JSON.stringify(camera) });

    alert("Camera added successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Camera className="w-6 h-6 mr-2" />
        Add New Camera
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Camera Name</label>
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
          <label className="block text-sm font-medium text-gray-700">Camera Type</label>
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
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Input
            type="text"
            name="location"
            value={camera.location}
            onChange={handleChange}
            required
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stream URL</label>
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
