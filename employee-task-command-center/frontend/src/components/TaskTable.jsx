import { useMemo, useState } from "react";
import Reveal from "./Reveal.jsx";

const STATUS_CLASS = {
  Pending: "status-pending",
  "In Progress": "status-in-progress",
  Completed: "status-completed",
};

const PRIORITY_CLASS = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

export default function TaskTable({ employees, tasks, onStatusChange, onDeleteTask }) {
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (employeeFilter !== "all" && t.employee_id !== employeeFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, employeeFilter, statusFilter, priorityFilter]);

  return (
    <div className="section-block" id="employee-tasks">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Directory</span>
          <h2>Employee task list</h2>
          <p>Slice through every assignment by employee, status, or priority to spot what needs your attention next.</p>
        </div>
      </Reveal>

      <Reveal as="div" className="filter-bar">
        <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
          <option value="all">All employees</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </Reveal>

      <Reveal as="div" className="table-wrap">
        {filtered.length === 0 ? (
          <div className="table-empty">No tasks match these filters yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Task</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td data-label="Employee"><strong>{t.employeeName}</strong></td>
                  <td data-label="Department">{t.department}</td>
                  <td data-label="Task">{t.title}</td>
                  <td data-label="Due Date">{t.due_date}</td>
                  <td data-label="Priority">
                    <span className={`badge ${PRIORITY_CLASS[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`badge ${STATUS_CLASS[t.status]}`}>{t.status}</span>
                  </td>
                  <td data-label="Actions">
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select className="status-select" value={t.status} onChange={(e) => onStatusChange(t, e.target.value)}>
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                      <button className="btn-ghost" type="button" onClick={() => onDeleteTask(t)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Reveal>
    </div>
  );
}
