"use client";

import { useState, useEffect } from "react";
import { Heart, HeartPulse, Plus } from "lucide-react"; // Importing icons from Lucide
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SensorsPage() {
  const [widgetUrl, setWidgetUrl] = useState(
    "https://extensions.hyperate.io/Configurator/?deviceId=7C7A&view=graph&heartColor=%23ff0000&heartSize=40px&fontColor=%23ff0000&fontFamily=Arial&fontWeight=normal&fontSize=40px&animationType=beat&heartShape=classic&lineColor=%23ff0000&maxDataPoints=30&lineThickness=2&pointColor=%23ff0000&pointSize=4&labelFontSize=12&lineStyle=dashed&width=300px&height=200px&layout=%257B%2522heart%2522%253A%257B%2522x%2522%253A2%252C%2522y%2522%253A8%257D%252C%2522rate%2522%253A%257B%2522x%2522%253A49%252C%2522y%2522%253A1%257D%252C%2522graph%2522%253A%257B%2522x%2522%253A0%252C%2522y%2522%253A24%257D%252C%2522visibility%2522%253A%257B%2522showGraph%2522%253Atrue%252C%2522showHeart%2522%253Atrue%252C%2522showRate%2522%253Atrue%257D%257D"
  );

  const [heartRate, setHeartRate] = useState(70);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState({ name: "Heart Rate Monitor", url: widgetUrl });

  // Set up the WebSocket connection
  useEffect(() => {
    const socket = new WebSocket('wss://app.hyperate.io/socket/websocket?token=astobRkornAHAizEZGIo3pVYBDHyrkEtw8v2AEP804fpQ0G4uRh0OHT3vtgBPTy2');

    // When the WebSocket connection is open
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    // When a message is received from the WebSocket server
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.heartRate) {
        const newHeartRate = data.heartRate;
        setHeartRate(newHeartRate);

        const updatedUrl = `https://extensions.hyperate.io/Configurator/?deviceId=7C7A&view=graph&heartColor=%23ff0000&heartSize=40px&fontColor=%23ff0000&fontFamily=Arial&fontWeight=normal&fontSize=40px&animationType=beat&heartShape=classic&lineColor=%23ff0000&maxDataPoints=${newHeartRate}&lineThickness=2&pointColor=%23ff0000&pointSize=4&labelFontSize=12&lineStyle=solid&width=300px&height=200px&layout=%257B%2522heart%2522%253A%257B%2522x%2522%253A2%252C%2522y%2522%253A8%257D%252C%2522rate%2522%253A%257B%2522x%2522%253A49%252C%2522y%2522%253A1%257D%252C%2522graph%2522%253A%257B%2522x%2522%253A0%252C%2522y%2522%253A24%257D%252C%2522visibility%2522%253A%257B%2522showGraph%2522%253Atrue%252C%2522showHeart%2522%253Atrue%252C%2522showRate%2522%253Atrue%257D%257D`;

        setWidgetUrl(updatedUrl);
      }
    };

    // Handle WebSocket errors
    socket.onerror = (error) => {
      console.log("WebSocket Error: ", error);
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleSaveSensor = (e) => {
    e.preventDefault();
    setWidgetUrl(selectedSensor.url); // Update the URL of the iframe
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Sensors</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          key={selectedSensor.id} 
          className="dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
          onClick={() => setIsModalOpen(true)} // Open the form to edit sensor
        >
          <CardHeader className="flex items-center justify-between dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <HeartPulse className="h-8 w-8 text-red-500" />
              <CardTitle className="dark:text-white">{selectedSensor.name}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="relative aspect-video w-full overflow-hidden border dark:border-gray-700 flex items-center justify-center">
            {/* Iframe container with scaling */}
            <div className="relative w-full h-full">
              <iframe
                src={widgetUrl}
                key={heartRate}  // Force iframe refresh when heartRate changes
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: "none", overflow: "hidden"}}
                title="Heart Rate Monitor"
                scrolling="no"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Sensor Button */}
      <Button
        variant="default"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        onClick={() => setIsModalOpen(true)} // Open form to add a new sensor
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Edit Sensor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSensor?.id ? "Edit Sensor" : "Add Sensor"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSensor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">Sensor Name</label>
              <Input
                type="text"
                value={selectedSensor?.name || ""}
                onChange={(e) => setSelectedSensor({ ...selectedSensor, name: e.target.value })}
                required
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Enter sensor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">OBS Widget URL</label>
              <Input
                type="text"
                value={selectedSensor?.url || ""}
                onChange={(e) => setSelectedSensor({ ...selectedSensor, url: e.target.value })}
                required
                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Enter OBS widget URL"
              />
            </div>
            <Button type="submit" className="w-full">
              Save Sensor
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
