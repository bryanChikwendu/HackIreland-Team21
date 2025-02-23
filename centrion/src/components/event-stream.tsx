import React, { useEffect, useRef, useState } from "react";
import { WebSocketClient } from "@/lib/websocket-client";

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
  const [isPolling, setIsPolling] = useState(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new events come in
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  // Handle incoming AI responses
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
      }
    };

    websocketClient.on("modelMessage", handleModelMessage);
    return () => {
      websocketClient.off("modelMessage", handleModelMessage);
    };
  }, [websocketClient]);

  // Handle continuous prompting
  useEffect(() => {
    const startPolling = () => {
      if (pollingInterval.current) return;

      const pollForEvents = () => {
        websocketClient.sendText(
          "Describe any new or notable changes in what you see in the video feed. Focus only on significant changes and keep your response to a single, brief sentence."
        );
      };

      // Initial poll
      pollForEvents();

      // Set up interval
      pollingInterval.current = setInterval(pollForEvents, 3000);
      setIsPolling(true);
    };

    const stopPolling = () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      setIsPolling(false);
    };

    if (isConnected) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isConnected, websocketClient]);

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-300 p-4 dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Event Stream</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isConnected
            ? isPolling
              ? "Monitoring video feed for events..."
              : "Starting event monitoring..."
            : "Connect to start monitoring events"}
        </p>
      </div>

      {/* Event Stream List with Dark Mode Scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
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
                <p className="text-gray-800 dark:text-gray-100">
                  {event.description.replace("Event:", "").trim()}
                </p>
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={eventsEndRef} />
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
