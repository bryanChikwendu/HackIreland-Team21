"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Trash, BellRing, Lightbulb, Mic, Phone, Code, Mail, Activity, Droplet } from "lucide-react";

export default function ActionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedActionIndex, setSelectedActionIndex] = useState(null);

  const [actions, setActions] = useState([
    { title: "Call Emergency Service", description: "Automatically call emergency services in case of danger.", action: "Phone Call" },
    { title: "Turn On Lights", description: "Switch on lights when motion is detected.", action: "Activate Lights" },
    { title: "Open Microphone", description: "Enable microphone for real-time audio monitoring.", action: "Enable Mic" },
    { title: "Send Audio Input (TTS)", description: "Broadcast a pre-recorded or generated text-to-speech message.", action: "Audio Alert" },
    { title: "Turn On Sprinklers", description: "Activate sprinklers in case of fire detection.", action: "Fire Safety" },
    { title: "Send Text SMS", description: "Send an SMS alert to predefined contacts.", action: "Text Alert" },
    { title: "Alert Private Security", description: "Notify private security about an incident.", action: "Security Alert" },
    { title: "Send Webhook", description: "Trigger an external webhook event.", action: "Webhook Notification" },
    { title: "Send API Request", description: "Make an API request to another system.", action: "API Call" },
    { title: "Send an Email", description: "Send an automated email notification.", action: "Email" },
  ]);

  const [newAction, setNewAction] = useState({
    title: "",
    description: "",
    action: "",
  });

  const actionsList = [
    "Phone Call",
    "Activate Lights",
    "Enable Mic",
    "Audio Alert",
    "Fire Safety",
    "Text Alert",
    "Security Alert",
    "Webhook Notification",
    "API Call",
    "Email"
  ];

  const handleAddNew = () => {
    setNewAction({ title: "", description: "", action: "" });
    setEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditAction = (index) => {
    setNewAction(actions[index]);
    setSelectedActionIndex(index);
    setEditMode(true);
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      const updatedActions = [...actions];
      updatedActions[selectedActionIndex] = newAction;
      setActions(updatedActions);
    } else {
      setActions([...actions, newAction]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    setActions(actions.filter((_, index) => index !== selectedActionIndex));
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">System Actions</h1>

      {/* Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => handleEditAction(index)}
          >
            <div className="flex items-center space-x-3">
              {action.action.includes("Phone") && <Phone className="h-6 w-6 text-blue-500" />}
              {action.action.includes("Lights") && <Lightbulb className="h-6 w-6 text-yellow-500" />}
              {action.action.includes("Mic") && <Mic className="h-6 w-6 text-gray-500" />}
              {action.action.includes("Fire") && <Droplet className="h-6 w-6 text-blue-500" />}
              {action.action.includes("Alert") && <BellRing className="h-6 w-6 text-red-500" />}
              {action.action.includes("Webhook") && <Code className="h-6 w-6 text-purple-500" />}
              {action.action.includes("Email") && <Mail className="h-6 w-6 text-green-500" />}
              {action.action.includes("API") && <Activity className="h-6 w-6 text-orange-500" />}
              <h3 className="font-semibold">{action.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{action.description}</p>
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

      {/* Add/Edit Action Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{editMode ? "Edit Action" : "Add New Action"}</h2>
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
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  required
                  placeholder="Enter action title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  required
                  placeholder="Describe the purpose of this action"
                />
              </div>

              {/* Spaced Buttons */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-3 sm:space-y-0">
                {editMode && (
                  <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
                    <Trash className="h-5 w-5 mr-2" />
                    Delete
                  </Button>
                )}
                <Button type="submit" className="w-full sm:w-auto">
                  {editMode ? "Update Action" : "Add Action"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
