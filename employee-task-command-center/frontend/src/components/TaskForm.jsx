import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import { IconAssign, IconCheck, IconAlert } from "../icons.jsx";

function emptyForm(employees) {
  return {
    employee_id: employees[0]?.id || "",
    title: "",
    description: "",
    assigned_date: new Date().toISOString().slice(0, 10),
    due_date: "",
    priority: "Medium",
    status: "Pending",
  };
}

export default function TaskForm({ employees, onAssignTask }) {
  const [form, setForm] = useState(() => emptyForm(employees));
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!form.employee_id && employees.length > 0) {
      setForm((prev) => ({ ...prev, employee_id: employees[0].id }));
    }
  }, [employees, form.employee_id]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.employee_id) {
      setFeedback({ type: "error", message: "Add an employee first — there's no one to assign this task to." });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    try {
      await onAssignTask(form);
      setFeedback({ type: "success", message: `“${form.title}” was assigned successfully.` });
      setForm(emptyForm(employees));
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Could not assign task." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-block" id="assign">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Workload</span>
          <h2>Assign a new task</h2>
          <p>Hand off work with full context — priority, timeline, and status — so it lands directly on the task board.</p>
        </div>
      </Reveal>

      <Reveal as="div" className="glass-card" style={{ maxWidth: 760 }}>
        {employees.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>
            No employees yet. Add a teammate first from the <strong>Employees</strong> section, then come back to assign work.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="task-employee">Select Employee</label>
                <select id="task-employee" value={form.employee_id} onChange={(e) => update("employee_id", e.target.value)}>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field span-2">
                <label htmlFor="task-title">Task Title</label>
                <input id="task-title" required value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Design the analytics widget" />
              </div>

              <div className="field span-2">
                <label htmlFor="task-desc">Task Description</label>
                <textarea id="task-desc" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Add scope, links, or acceptance criteria…" />
              </div>

              <div className="field">
                <label htmlFor="task-assigned">Assigned Date</label>
                <input id="task-assigned" type="date" required value={form.assigned_date} onChange={(e) => update("assigned_date", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="task-due">Due Date</label>
                <input id="task-due" type="date" required value={form.due_date} onChange={(e) => update("due_date", e.target.value)} />
              </div>

              <div className="field">
                <label htmlFor="task-priority">Priority</label>
                <select id="task-priority" value={form.priority} onChange={(e) => update("priority", e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="task-status">Status</label>
                <select id="task-status" value={form.status} onChange={(e) => update("status", e.target.value)}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                <IconAssign /> {submitting ? "Assigning…" : "Assign Task"}
              </button>
              {feedback && (
                <span className={`form-feedback ${feedback.type}`}>
                  {feedback.type === "success" ? <IconCheck /> : <IconAlert />}
                  {feedback.message}
                </span>
              )}
            </div>
          </form>
        )}
      </Reveal>
    </div>
  );
}
