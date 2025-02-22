"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AudioWaveform, Activity, Link, Code, Phone, Mail, Plus, X } from "lucide-react";

export default function ActionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [action, setAction] = useState({
    title: "",
    purpose: "",
    action: "",
  });

  const handleChange = (e) => {
    setAction({
      ...action,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Action:", action);
    alert("Action added successfully!");
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">System Actions</h1>

      {/* Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Audio", icon: <AudioWaveform className="h-6 w-6" />, description: "Trigger audio alerts" },
          { name: "BPM", icon: <Activity className="h-6 w-6" />, description: "Monitor biometric signals" },
          { name: "Webhooks", icon: <Link className="h-6 w-6" />, description: "Connect external services" },
          { name: "API", icon: <Code className="h-6 w-6" />, description: "Trigger API-based actions" },
          { name: "Phone", icon: <Phone className="h-6 w-6" />, description: "Send automated calls" },
          { name: "Email", icon: <Mail className="h-6 w-6" />, description: "Send automated emails" },
        ].map((tile, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
            <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-md">{tile.icon}</div>
            <div>
              <h3 className="font-semibold">{tile.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{tile.description}</p>
            </div>
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

      {/* Add Action Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New Action</h2>
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
                  value={action.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter action title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={action.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe the purpose of this action"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Action</label>
                <Input
                  type="text"
                  name="action"
                  value={action.action}
                  onChange={handleChange}
                  required
                  placeholder="Enter action details"
                />
              </div>

              <Button type="submit" className="w-full">
                Add Action
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
