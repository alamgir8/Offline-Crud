export function sortTasksByDate(tasks) {
  return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function filterTasksByStatus(tasks, status) {
  return tasks.filter(task => task.status === status);
}

export function generateTaskId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}