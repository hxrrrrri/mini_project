import { useState } from "react";
import Reveal from "./Reveal.jsx";
import { IconPlus, IconCheck, IconAlert } from "../icons.jsx";

const EMPTY = { name: "", employee_id: "", department: "", email: "", role: "" };

export default function EmployeeForm({ onAddEmployee }) {
  const [form, setForm] = useState(EMPTY);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      await onAddEmployee(form);
      setFeedback({ type: "success", message: `${form.name} was added to the team.` });
      setForm(EMPTY);
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Could not add employee." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-block" id="employees">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Team</span>
          <h2>Add a new employee</h2>
          <p>Bring a new teammate into the command center — they'll instantly become assignable across the task board.</p>
        </div>
      </Reveal>

      <Reveal as="div" className="glass-card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="emp-name">Employee Name</label>
              <input id="emp-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Harisankar S" />
            </div>
            <div className="field">
              <label htmlFor="emp-id">Employee ID</label>
              <input id="emp-id" required value={form.employee_id} onChange={(e) => update("employee_id", e.target.value)} placeholder="e.g. EMP-105" />
            </div>
            <div className="field">
              <label htmlFor="emp-dept">Department</label>
              <input id="emp-dept" required value={form.department} onChange={(e) => update("department", e.target.value)} placeholder="e.g. Development" />
            </div>
            <div className="field">
              <label htmlFor="emp-role">Role</label>
              <input id="emp-role" required value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="e.g. Junior Developer" />
            </div>
            <div className="field span-2">
              <label htmlFor="emp-email">Email</label>
              <input id="emp-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="name@example.com" />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-accent" type="submit" disabled={submitting}>
              <IconPlus /> {submitting ? "Adding…" : "Add Employee"}
            </button>
            {feedback && (
              <span className={`form-feedback ${feedback.type}`}>
                {feedback.type === "success" ? <IconCheck /> : <IconAlert />}
                {feedback.message}
              </span>
            )}
          </div>
        </form>
      </Reveal>
    </div>
  );
}
