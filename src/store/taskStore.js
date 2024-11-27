import { create } from "zustand";
import { dbOperations } from "../lib/db.js";
import { p2pManager } from "../lib/p2p.js";
import { generateTaskId } from "../lib/utils/taskUtils.js";
import { TASK_STATUS } from "../lib/constants.js";

export const useTaskStore = create((set, get) => ({
  tasks: [],

  addTask: async (taskData) => {
    const task = {
      ...taskData,
      id: generateTaskId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await dbOperations.addTask(task);
      set((state) => ({ tasks: [...state.tasks, task] }));
      p2pManager.broadcastTaskUpdate(task);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = {
        ...task,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await dbOperations.updateTask(updatedTask);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
      }));
      p2pManager.broadcastTaskUpdate(updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  },

  deleteTask: async (id) => {
    try {
      await dbOperations.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
      p2pManager.broadcastTaskUpdate({ id, deleted: true });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  },

  loadTasks: async () => {
    try {
      const tasks = await dbOperations.getAllTasks();
      set({ tasks });
    } catch (error) {
      console.error("Failed to load tasks:", error);
      set({ tasks: [] });
    }
  },
}));
