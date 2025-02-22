"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, BellRing } from "lucide-react";

export default function ListenersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [listeners, setListeners] = useState([
    { title: "Door Open", description: "Call me when the door opens", action: "Phone Call" },
    { title: "Man in Hoodie", description: "Email me when a man in a hoodie walks by", action: "Email Alert" },
  ]);
  const [newListener, setNewListener] = useState({
    title: "",
    description: "",
    purpose: "",
    action: "",
  });

  const actionsList = ["Audio Alert", "BPM Monitoring", "Webhook Trigger", "API Call", "Phone Call", "Email Alert"];

  const handleChange = (e) => {
    setNewListener({
      ...newListener,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setListeners([...listeners, newListener]);
    setNewListener({ title: "", description: "", purpose: "", action: "" });
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Event Listeners</h1>

      {/* Listener Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeners.map((listener, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
            <div className="flex items-center space-x-3">
              <BellRing className="h-6 w-6 text-blue-500" />
              <h3 className="font-semibold">{listener.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{listener.description}</p>
            <p className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-300">Action: {listener.action}</p>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <Button
        variant="default"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        onClick={() => setIsFormOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add Listener Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Listener</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <Input
                  type="text"
                  name="title"
                  value={newListener.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newListener.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the event listener"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Purpose</label>
                <Textarea
                  name="purpose"
                  value={newListener.purpose}
                  onChange={handleChange}
                  required
                  placeholder="Why is this listener needed?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Action</label>
                <select
                  name="action"
                  value={newListener.action}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none bg-gray-100 dark:bg-gray-800"
                >
                  <option value="" disabled>Select an action</option>
                  {actionsList.map((action, idx) => (
                    <option key={idx} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full">
                Add Listener
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
