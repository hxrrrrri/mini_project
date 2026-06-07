const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const detail = body && body.detail ? body.detail : `Request failed (${res.status})`;
    throw new Error(detail);
  }
  return body;
}

export const api = {
  ping: () => request("/"),
  getEmployees: () => request("/employees"),
  addEmployee: (payload) =>
    request("/employees", { method: "POST", body: JSON.stringify(payload) }),
  getTasks: () => request("/tasks"),
  getTasksForEmployee: (employeeId) => request(`/tasks/${employeeId}`),
  assignTask: (payload) =>
    request("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  updateTaskStatus: (taskId, status) =>
    request(`/tasks/${taskId}`, { method: "PUT", body: JSON.stringify({ status }) }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: "DELETE" }),
};

export const API_ENDPOINTS = [
  { method: "POST", path: "/employees", description: "Add a new employee record" },
  { method: "GET", path: "/employees", description: "List all employees" },
  { method: "POST", path: "/tasks", description: "Assign a task to an employee" },
  { method: "GET", path: "/tasks", description: "List all tasks" },
  { method: "GET", path: "/tasks/{employee_id}", description: "List tasks for one employee" },
  { method: "PUT", path: "/tasks/{task_id}", description: "Update a task's status" },
  { method: "DELETE", path: "/tasks/{task_id}", description: "Delete a task record" },
];

export { BASE_URL };
