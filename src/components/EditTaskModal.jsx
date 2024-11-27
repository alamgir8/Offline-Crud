import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-gray-700"
            >
              Task Title
            </label>
            <input
              type="text"
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none shadow-sm p-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
