import { create } from "zustand";
import { dbOperations } from "../lib/db.js";
import { p2pManager } from "../lib/p2p";
import { generateTaskId } from "../lib/utils/taskUtils.js";

export const useTaskStore = create((set) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  loadTasks: async () => {
    try {
      const tasks = await dbOperations.getAllTasks(); // Fetch tasks from IndexedDB
      set({ tasks });
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  },

  addTask: async (taskData, username) => {
    const task = {
      ...taskData,
      id: generateTaskId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: localStorage.getItem("username"),
    };

    try {
      await dbOperations.addTask(task); // Save to local IndexedDB
      set((state) => ({ tasks: [...state.tasks, task] }));

      p2pManager.addTask(task);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTask: async (id, updates) => {
    const updatedTask = {
      ...updates,
      id,
      updatedAt: new Date().toISOString(), // Always update the updatedAt timestamp
      updatedBy: localStorage.getItem("username"),
    };

    // Retain the original createdAt value from the existing task
    const originalTask = useTaskStore
      .getState()
      .tasks.find((task) => task.id === id);
    if (originalTask) {
      updatedTask.createdAt = originalTask.createdAt;
    }
    try {
      await dbOperations.updateTask(updatedTask); // Save to local IndexedDB
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
      // Call the p2pManager method to update the task
      p2pManager.updateTask({ id: id, ...updatedTask });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  deleteTask: async (id) => {
    try {
      await dbOperations.deleteTask(id); // Remove from local IndexedDB
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      // Call the p2pManager method to delete the task
      p2pManager.deleteTask(id); // This triggers the socket event to delete the task
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  },
}));
