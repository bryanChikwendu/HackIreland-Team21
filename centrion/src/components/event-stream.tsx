import React, { useState, useEffect, useRef } from "react";
import { WebSocketClient } from "@/lib/websocket-client";
import { Bell } from "lucide-react"; // Bell icon for the alert

interface Event {
  id: string;
  description: string;
  timestamp: Date;
}

interface EventStreamProps {
  websocketClient: WebSocketClient;
  isConnected: boolean;
}

export default function EventStream({ websocketClient, isConnected }: EventStreamProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]); // To store alerts
  const [isPolling, setIsPolling] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const eventStreamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleModelMessage = (message: string) => {
      if (message.trim()) {
        setEvents((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2),
            description: message,
            timestamp: new Date(),
          },
        ]);

        // If message contains '[MONITOR]', create an alert
        if (message.includes("[MONITOR]")) {
          setAlerts((prevAlerts) => [
            ...prevAlerts,
            `New monitoring alert: ${message}`,
          ]);
        }
      }
    };

    websocketClient.on("modelMessage", handleModelMessage);
    return () => {
      websocketClient.off("modelMessage", handleModelMessage);
    };
  }, [websocketClient]);

  // Auto-scroll to the bottom when new events come in
  useEffect(() => {
    if (autoScrollEnabled && eventStreamRef.current) {
      eventStreamRef.current.scrollTop = eventStreamRef.current.scrollHeight;
    }
  }, [events, autoScrollEnabled]);

  const handleToggleAutoScroll = () => {
    setAutoScrollEnabled(!autoScrollEnabled);
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-300 p-4 dark:border-gray-700 flex justify-between">
        <div>
          <h2 className="text-xl font-bold dark:text-white">Event Stream</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isConnected
              ? isPolling
                ? "Monitoring video feed for events..."
                : "Starting event monitoring..."
              : "Connect to start monitoring events"}
          </p>
        </div>

        {/* Bell Icon Button to show alerts */}
        <div className="relative">
          <button
            className="text-gray-500 dark:text-gray-400"
            onClick={() => alert("Navigate to Alerts page")}
          >
            <Bell className="h-6 w-6" />
            {alerts.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2">
                {alerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Event Stream List */}
      <div
        ref={eventStreamRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No events detected yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
              >
                <p className="text-gray-800 dark:text-gray-100">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-300 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isPolling ? "Monitoring active" : "Monitoring paused"}
          </span>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isPolling ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
