// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"],
  },
});

let tasks = []; // In-memory task store

// Serve static assets (the Vite built app)
app.use(express.static("dist"));

// In server.js, make sure to serve the production files
app.use(express.static(path.join(__dirname, "dist")));

// Make sure to serve the app's index.html for non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.emit("tasks", tasks); // Send the current tasks to the client

    socket.on("add-task", (task) => {
      tasks.push(task);
      io.to(roomId).emit("task-updated", tasks); // Broadcast the updated tasks to everyone
    });

    socket.on("update-task", (updatedTask) => {
      tasks = tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      io.to(roomId).emit("task-updated", tasks);
    });

    socket.on("delete-task", (taskId) => {
      tasks = tasks.filter((task) => task.id !== taskId);
      io.emit("task-updated", tasks); // Broadcast updated tasks to all clients
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on http://localhost:${PORT}`);
});
