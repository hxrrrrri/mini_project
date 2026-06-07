import { useState } from "react";
import Reveal from "./Reveal.jsx";
import DeleteModal from "./DeleteModal.jsx";
import { IconTrash } from "../icons.jsx";

const COLUMNS = [
  { id: "Pending", title: "Pending", className: "column-pending" },
  { id: "In Progress", title: "In Progress", className: "column-progress" },
  { id: "Completed", title: "Completed", className: "column-completed" },
];

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

function TaskCard({ task, onStatusChange, onRequestDelete, flashId }) {
  return (
    <div className={`task-card${flashId === task.id ? " status-flash" : ""}`}>
      <div className="task-card-inner">
        <div className="task-card-top">
          <h4>{task.title}</h4>
          <button className="icon-btn-sm" type="button" aria-label="Delete task" onClick={() => onRequestDelete(task)}>
            <IconTrash />
          </button>
        </div>

        <div className="task-meta">
          <span className="person">
            {task.employeeName}
          </span>
          <span>· {task.department}</span>
          <span>· Due {task.due_date}</span>
        </div>

        <div className="badge-row">
          <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>{task.priority} priority</span>
          <span className={`badge ${STATUS_CLASS[task.status]}`}>{task.status}</span>
        </div>

        <div className="task-card-actions">
          <select
            className="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks, onStatusChange, onDeleteTask }) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [flashId, setFlashId] = useState(null);

  function handleStatusChange(task, status) {
    onStatusChange(task, status);
    setFlashId(task.id);
    window.setTimeout(() => setFlashId((id) => (id === task.id ? null : id)), 720);
  }

  function handleConfirmDelete(task) {
    onDeleteTask(task);
    setPendingDelete(null);
  }

  return (
    <div className="section-block" id="board">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Workflow</span>
          <h2>Task board</h2>
          <p>Drag the conversation forward — move work across Pending, In Progress, and Completed as your team makes progress.</p>
        </div>
      </Reveal>

      <div className="board-grid">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.id);
          return (
            <Reveal as="div" key={col.id} className={`board-column ${col.className}`}>
              <div className="board-column-head">
                <h3>{col.title}</h3>
                <span className="board-count">{columnTasks.length}</span>
              </div>
              <div className="board-column-rule" />
              <div className="board-column-body">
                {columnTasks.length === 0 ? (
                  <div className="board-empty">No tasks here yet.</div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      flashId={flashId}
                      onStatusChange={handleStatusChange}
                      onRequestDelete={setPendingDelete}
                    />
                  ))
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      <DeleteModal task={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={handleConfirmDelete} />
    </div>
  );
}
