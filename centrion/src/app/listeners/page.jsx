"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, BellRing, Trash } from "lucide-react";

export default function ListenersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedListenerIndex, setSelectedListenerIndex] = useState(null);

  const [listeners, setListeners] = useState([
    { title: "Baby Turns Over", description: "Call me when the baby turns over", action: "Phone Call" },
    { title: "Bag with Red Ribbon Passes", description: "Send an email when a bag with a red ribbon is detected", action: "Email Alert" },
    { title: "Elderly Person Falls", description: "Alert security when an elderly person falls", action: "Alert Private Security" },
    { title: "Bio Signals Are Erratic", description: "Trigger emergency response for unusual biometric signals", action: "Call Emergency Service" },
    { title: "Audio Signals", description: "Notify when abnormal audio patterns are detected", action: "Audio Alert" },
    { title: "Camera Is Covered", description: "Alert when the camera is physically obstructed", action: "Send Webhook" },
    { title: "Audio Is Jammed", description: "Notify when the microphone input is jammed", action: "Send API Request" },
    { title: "Postman Comes Over", description: "Notify when the postman arrives", action: "Send Text SMS" },
    { title: "Dangerous Event Occurs", description: "Trigger an alarm for critical security events", action: "Turn On Lights" },
  ]);

  const [newListener, setNewListener] = useState({
    title: "",
    description: "",
    action: "",
  });

  const actionsList = [
    "Call Emergency Service",
    "Turn On Lights",
    "Open Microphone",
    "Send Audio Input (TTS)",
    "Turn On Sprinklers",
    "Send Text SMS",
    "Alert Private Security",
    "Send Webhook",
    "Send API Request",
    "Send an Email"
  ];

  // Open form to add a new listener
  const handleAddNew = () => {
    setNewListener({ title: "", description: "", action: "" });
    setEditMode(false);
    setIsFormOpen(true);
  };

  // Open form to edit an existing listener
  const handleEditListener = (index) => {
    setNewListener(listeners[index]);
    setSelectedListenerIndex(index);
    setEditMode(true);
    setIsFormOpen(true);
  };

  // Save a new or edited listener
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Update existing listener
      const updatedListeners = [...listeners];
      updatedListeners[selectedListenerIndex] = newListener;
      setListeners(updatedListeners);
    } else {
      // Add new listener
      setListeners([...listeners, newListener]);
    }
    setIsFormOpen(false);
  };

  // Delete a listener
  const handleDelete = () => {
    setListeners(listeners.filter((_, index) => index !== selectedListenerIndex));
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Event Listeners</h1>

      {/* Listener Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listeners.map((listener, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => handleEditListener(index)}
          >
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
        onClick={handleAddNew}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add/Edit Listener Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editMode ? "Edit Listener" : "Add New Listener"}</h2>
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
                  onChange={(e) => setNewListener({ ...newListener, title: e.target.value })}
                  required
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newListener.description}
                  onChange={(e) => setNewListener({ ...newListener, description: e.target.value })}
                  required
                  placeholder="Describe the event listener"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Action</label>
                <select
                  name="action"
                  value={newListener.action}
                  onChange={(e) => setNewListener({ ...newListener, action: e.target.value })}
                  required
                  className="w-full px-3 py-2 border dark:border-gray-700 rounded-md focus:outline-none bg-gray-100 dark:bg-gray-800"
                >
                  <option value="" disabled>Select an action</option>
                  {actionsList.map((action, idx) => (
                    <option key={idx} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center space-x-4">
                {editMode && (
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash className="h-5 w-5 mr-2" />
                    Delete
                  </Button>
                )}
                <Button type="submit" className="w-full">
                  {editMode ? "Update Listener" : "Add Listener"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
