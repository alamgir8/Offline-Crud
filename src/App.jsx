import React, { useEffect, useState } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { StatusBar } from "./components/StatusBar";
import { useTaskStore } from "./store/taskStore";
import { p2pManager } from "./lib/p2p";
import Login from "./components/Login";

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [isMaster, setIsMaster] = useState(false);
  const [roomId, setRoomId] = useState("task-room-1"); // Example room ID
  // Client-Side (useEffect to sync tasks on reload)
  useEffect(() => {
    const initP2P = async () => {
      await p2pManager.init(username, roomId); // Reconnect and sync tasks
    };

    if (username) {
      initP2P();
      localStorage.setItem("username", username);
    }
  }, [username]);

  useEffect(() => {
    if (username === "Alamgir") {
      setIsMaster(true);
    }
  }, [username]);

  if (!username) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Login onLogin={setUsername} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Task Manager{" "}
            <span className="text-emerald-500">
              {isMaster ? "(Master)" : "(Child)"}
            </span>
          </h1>
          <StatusBar />
        </div>

        <div className="space-y-8">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App;
