import Peer from "peerjs";
import { dbOperations } from "./db.js";
import { useTaskStore } from "../store/taskStore.js";

class P2PManager {
  constructor() {
    this.peer = null;
    this.connections = new Map();
    this.peerId = null;
    this.broadcastChannel = new BroadcastChannel("task-sync");
    this.setupBroadcastChannel();
  }

  setupBroadcastChannel() {
    this.broadcastChannel.onmessage = (event) => {
      const { type, peerId, task } = event.data;
      if (type === "peer-announce" && peerId !== this.peerId) {
        this.connectToPeer(peerId);
      } else if (type === "task-update" && task) {
        this.handleTaskUpdate(task);
      }
    };
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
        debug: 2,
      });

      this.peer.on("open", (id) => {
        this.peerId = id;
        console.log("My peer ID is:", id);
        this.announcePeer();
        resolve();
      });

      this.peer.on("connection", this.handleIncomingConnection.bind(this));
      this.peer.on("error", (error) => {
        console.error("PeerJS error:", error);
        reject(error);
      });
    });
  }

  announcePeer() {
    this.broadcastChannel.postMessage({
      type: "peer-announce",
      peerId: this.peerId,
    });
  }

  async connectToPeer(peerId) {
    if (peerId === this.peerId || this.connections.has(peerId)) return;

    console.log("Connecting to peer:", peerId);
    const conn = this.peer.connect(peerId, {
      reliable: true,
      serialization: "json",
    });

    this.setupConnection(conn);
  }

  handleIncomingConnection(conn) {
    console.log("Incoming connection from:", conn.peer);
    this.setupConnection(conn);
  }

  setupConnection(conn) {
    conn.on("open", () => {
      console.log("Connection opened with:", conn.peer);
      this.connections.set(conn.peer, conn);
      this.syncTasks(conn);
    });

    conn.on("data", async (data) => {
      console.log("Received data:", data);
      if (data.type === "sync-request") {
        const tasks = await dbOperations.getAllTasks();
        conn.send({ type: "sync-response", tasks });
      } else if (data.type === "sync-response") {
        await this.mergeTasks(data.tasks);
      } else if (data.type === "task-update") {
        await this.handleTaskUpdate(data.task, conn.peer);
      }
    });

    conn.on("close", () => {
      console.log("Connection closed with:", conn.peer);
      this.connections.delete(conn.peer);
    });

    conn.on("error", (error) => {
      console.error("Connection error:", error);
      this.connections.delete(conn.peer);
    });
  }

  async syncTasks(conn) {
    conn.send({ type: "sync-request" });
  }

  async mergeTasks(remoteTasks) {
    const localTasks = await dbOperations.getAllTasks();
    const mergedTasks = this.mergeTaskArrays(localTasks, remoteTasks);

    for (const task of mergedTasks) {
      await dbOperations.updateTask(task);
    }

    useTaskStore.getState().loadTasks();
  }

  mergeTaskArrays(local, remote) {
    const taskMap = new Map();

    [...local, ...remote].forEach((task) => {
      const existing = taskMap.get(task.id);
      if (
        !existing ||
        new Date(task.updatedAt) > new Date(existing.updatedAt)
      ) {
        taskMap.set(task.id, task);
      }
    });

    return Array.from(taskMap.values());
  }

  broadcastTaskUpdate(task) {
    console.log("task need to broadcast", task, "connection", this.connections);

    // Broadcast to all WebRTC peers
    this.connections.forEach((conn) => {
      conn.send({ type: "task-update", task });
    });

    // Broadcast to other tabs/windows
    this.broadcastChannel.postMessage({
      type: "task-update",
      task,
    });
  }

  async handleTaskUpdate(task, senderId) {
    if (task.deleted) {
      await dbOperations.deleteTask(task.id);
    } else {
      await dbOperations.updateTask(task);
    }

    useTaskStore.getState().loadTasks();

    // Relay the update to other peers except the sender
    this.connections.forEach((conn, peerId) => {
      if (peerId !== senderId) {
        conn.send({ type: "task-update", task });
      }
    });
  }
}

export const p2pManager = new P2PManager();
