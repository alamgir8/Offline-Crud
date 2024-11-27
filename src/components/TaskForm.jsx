import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useTaskStore } from "../store/taskStore.js";
import { TASK_STATUS } from "../lib/constants.js";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title,
      description,
      status: TASK_STATUS.PENDING,
    });

    setTitle("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none shadow-sm h-10 p-2"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none shadow-sm p-2"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Add Task
      </button>
    </form>
  );
}
