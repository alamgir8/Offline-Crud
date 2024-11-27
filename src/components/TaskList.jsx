import React, { useState } from "react";
import { Check, Trash2, RefreshCw, Edit2 } from "lucide-react";
import { useTaskStore } from "../store/taskStore.js";
import { format } from "date-fns";
import { TASK_STATUS } from "../lib/constants.js";
import { EditTaskModal } from "./EditTaskModal.jsx";

export function TaskList() {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const [editingTask, setEditingTask] = useState(null);

  const toggleStatus = (task) => {
    updateTask(task.id, {
      status:
        task.status === TASK_STATUS.PENDING
          ? TASK_STATUS.COMPLETED
          : TASK_STATUS.PENDING,
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (updates) => {
    if (editingTask) {
      updateTask(editingTask.id, updates);
      setEditingTask(null);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white p-4 rounded-lg shadow-md ${
            task.status === TASK_STATUS.COMPLETED ? "opacity-75" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3
                className={`text-lg font-medium ${
                  task.status === TASK_STATUS.COMPLETED
                    ? "line-through text-gray-500"
                    : ""
                }`}
              >
                {task.title}
              </h3>
              <p className="text-gray-600 mt-1">{task.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                Created: {format(new Date(task.createdAt), "PPp")}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="p-2 rounded-full bg-blue-100 text-blue-600"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => toggleStatus(task)}
                className={`p-2 rounded-full ${
                  task.status === TASK_STATUS.COMPLETED
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {task.status === TASK_STATUS.COMPLETED ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-full bg-red-100 text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
