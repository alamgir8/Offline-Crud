import { io } from "socket.io-client";
import { useTaskStore } from "../store/taskStore.js";
class P2PManager {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.isMaster = false;
  }

  async init(username, roomId) {
    this.socket = io("http://localhost:3001"); // Server URL

    // Join the room
    this.roomId = roomId;
    this.socket.emit("join-room", roomId);

    // Fetch and sync tasks when connected
    this.socket.on("tasks", (tasks) => {
      useTaskStore.getState().setTasks(tasks);
    });

    // Listen for task updates
    this.socket.on("task-updated", (tasks) => {
      useTaskStore.getState().setTasks(tasks);
    });
  }

  addTask(task) {
    this.socket.emit("add-task", task);
  }

  updateTask(task) {
    this.socket.emit("update-task", task);
  }

  deleteTask(taskId) {
    this.socket.emit("delete-task", taskId);
  }
}

export const p2pManager = new P2PManager();
