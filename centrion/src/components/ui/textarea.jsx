"use client";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-md focus:outline-none resize-none ${
        className || "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
      }`}
      {...props}
    />
  );
}
