"use client";

import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react'; // icons
import { Button } from '@/components/ui/button';

// Define the roles
const roles = ["Admin", "User", "Manager", "Guest"];

const UserPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "Admin", iconColor: "bg-blue-500" },
    { id: 2, name: "Jane Smith", role: "User", iconColor: "bg-green-500" },
    { id: 3, name: "Robert Brown", role: "Manager", iconColor: "bg-yellow-500" },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(null); // Manage which dropdown is open

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    setDropdownOpen(null); // Close dropdown after selection
  };

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId); // Toggle dropdown for the selected user
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Users List */}
      <div className="space-y-4">
        {users.map(user => (
          <div
            key={user.id}
            className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {/* User Icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.iconColor}`}>
              <User className="text-white w-6 h-6" />
            </div>

            {/* User Details */}
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>

            {/* Dropdown Button to change role */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => toggleDropdown(user.id)}>
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </Button>

              {/* Dropdown Menu */}
              {dropdownOpen === user.id && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 z-10">
                  {roles.map(role => (
                    <div
                      key={role}
                      onClick={() => handleRoleChange(user.id, role)}
                      className="text-gray-900 dark:text-white px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
