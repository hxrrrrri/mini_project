import Reveal from "./Reveal.jsx";

const STATUS_PROGRESS = {
  Pending: 12,
  "In Progress": 58,
  Completed: 100,
};

const SUMMARY_BY_STATUS = {
  Pending: "Scoped the work and queued it up — kicking off shortly.",
  "In Progress": "Made solid progress today and is on track for the due date.",
  Completed: "Wrapped up and verified — ready for review.",
};

const STATUS_CLASS = {
  Pending: "pending",
  "In Progress": "in-progress",
  Completed: "completed",
};

const PROGRESS_BLOCKS = 18;

export default function DailyUpdates({ tasks }) {
  const updates = [...tasks]
    .sort((a, b) => (a.assigned_date < b.assigned_date ? 1 : -1))
    .slice(0, 8);

  return (
    <div className="section-block" id="updates">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Daily Pulse</span>
          <h2>Daily work updates</h2>
          <p>A running timeline of what each teammate has been moving forward, generated from their latest task activity.</p>
        </div>
      </Reveal>

      <Reveal as="div" className="glass-card">
        {updates.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>No activity yet — assign a task to start the timeline.</p>
        ) : (
          <div className="timeline">
            {updates.map((t) => {
              const progress = STATUS_PROGRESS[t.status];
              const filledBlocks = Math.max(1, Math.round((progress / 100) * PROGRESS_BLOCKS));
              const statusClass = STATUS_CLASS[t.status];

              return (
                <div className="timeline-item" key={t.id}>
                  <div className={`timeline-card progress-${statusClass}`}>
                    <div className="timeline-head">
                      <div className="timeline-person">
                        <span>
                          <strong>{t.employeeName}</strong>
                          <span>{t.department} · working on “{t.title}”</span>
                        </span>
                      </div>
                      <span className="timeline-date">{t.assigned_date}</span>
                    </div>
                    <p className="timeline-summary">{SUMMARY_BY_STATUS[t.status]}</p>
                    <div className="xp-progress" role="progressbar" aria-label={`${t.status} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                      {Array.from({ length: PROGRESS_BLOCKS }, (_, index) => (
                        <span className={index < filledBlocks ? "filled" : ""} key={index} />
                      ))}
                    </div>
                    <span className="progress-meta">{progress}% progress · {t.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Reveal>
    </div>
  );
}
