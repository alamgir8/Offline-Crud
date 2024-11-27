import React, { useEffect } from "react";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { StatusBar } from "./components/StatusBar";
import { useTaskStore } from "./store/taskStore";

function App() {
  const loadTasks = useTaskStore((state) => state.loadTasks);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
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
