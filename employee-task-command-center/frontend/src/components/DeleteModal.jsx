import { IconAlert } from "../icons.jsx";

export default function DeleteModal({ task, onCancel, onConfirm }) {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <span className="stat-icon" style={{ background: "rgba(229,72,77,0.12)", color: "var(--danger)", border: "1px solid rgba(229,72,77,0.25)" }}>
          <IconAlert />
        </span>
        <h3>Delete this task?</h3>
        <p>
          “{task.title}” assigned to <strong>{task.employeeName}</strong> will be permanently removed from the board. This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel} type="button">Cancel</button>
          <button className="btn btn-danger" onClick={() => onConfirm(task)} type="button">Delete Task</button>
        </div>
      </div>
    </div>
  );
}
