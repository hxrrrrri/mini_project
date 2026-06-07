import { useMemo } from "react";
import Reveal from "./Reveal.jsx";

const PRIORITY_COLORS = { High: "var(--coral)", Medium: "var(--warning, #f5a623)", Low: "var(--success)" };
const LINEAR_BLOCKS = 18;
const RING_BLOCKS = 28;

function blockCount(value, max, totalBlocks) {
  if (!value) return 0;
  return Math.max(1, Math.round((value / Math.max(1, max)) * totalBlocks));
}

export default function Reports({ employees, tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const completionPct = total ? Math.round((completed / total) * 100) : 0;

    const byDept = {};
    employees.forEach((e) => { byDept[e.department] = byDept[e.department] || 0; });
    tasks.forEach((t) => { byDept[t.department] = (byDept[t.department] || 0) + 1; });
    const deptRows = Object.entries(byDept).sort((a, b) => b[1] - a[1]);
    const maxDept = Math.max(1, ...deptRows.map(([, v]) => v));

    const byPriority = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach((t) => { byPriority[t.priority] = (byPriority[t.priority] || 0) + 1; });
    const maxPriority = Math.max(1, ...Object.values(byPriority));

    const recent = [...tasks].slice(-6).reverse();

    return { total, completed, completionPct, deptRows, maxDept, byPriority, maxPriority, recent };
  }, [employees, tasks]);

  const deptColors = ["var(--teal)", "var(--coral)", "var(--amber)", "var(--success)", "var(--coral-soft)"];

  return (
    <div className="section-block" id="reports">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Insights</span>
          <h2>Reports &amp; analytics</h2>
          <p>A quick read on completion health, where the workload concentrates, and what's been moving recently — no chart library required.</p>
        </div>
      </Reveal>

      <div className="report-grid">
        <Reveal as="div" className="glass-card report-card">
          <h3>Task completion</h3>
          <div className="donut-wrap">
            <div className="xp-ring" role="progressbar" aria-label="Task completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={stats.completionPct}>
              {Array.from({ length: RING_BLOCKS }, (_, index) => (
                <span
                  className={index < blockCount(stats.completionPct, 100, RING_BLOCKS) ? "filled" : ""}
                  key={index}
                  style={{ "--i": index, "--ring-color": "var(--coral)" }}
                />
              ))}
              <div className="xp-ring-inner">
                <strong>{stats.completionPct}%</strong>
                <span>Completed</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, color: "var(--text-faint)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text)" }}>{stats.completed}</strong> of <strong style={{ color: "var(--text)" }}>{stats.total}</strong> tasks
                wrapped up across the team. Keep momentum by clearing what's still pending on the board.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal as="div" className="glass-card report-card">
          <h3>Department-wise task count</h3>
          <div className="bar-rows">
            {stats.deptRows.length === 0 && <p style={{ fontSize: 13, color: "var(--text-faint)" }}>No departments yet.</p>}
            {stats.deptRows.map(([dept, count], i) => (
              <div className="bar-row" key={dept}>
                <span>{dept}</span>
                <span className="report-xp-bar" role="progressbar" aria-label={`${dept} task count`} aria-valuemin="0" aria-valuemax={stats.maxDept} aria-valuenow={count}>
                  {Array.from({ length: LINEAR_BLOCKS }, (_, index) => (
                    <span
                      className={index < blockCount(count, stats.maxDept, LINEAR_BLOCKS) ? "filled" : ""}
                      key={index}
                      style={{ "--bar-color": deptColors[i % deptColors.length] }}
                    />
                  ))}
                </span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" className="glass-card report-card">
          <h3>Priority distribution</h3>
          <div className="bar-rows">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div className="bar-row" key={priority}>
                <span>{priority}</span>
                <span className="report-xp-bar" role="progressbar" aria-label={`${priority} priority count`} aria-valuemin="0" aria-valuemax={stats.maxPriority} aria-valuenow={count}>
                  {Array.from({ length: LINEAR_BLOCKS }, (_, index) => (
                    <span
                      className={index < blockCount(count, stats.maxPriority, LINEAR_BLOCKS) ? "filled" : ""}
                      key={index}
                      style={{ "--bar-color": PRIORITY_COLORS[priority] }}
                    />
                  ))}
                </span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" className="glass-card report-card">
          <h3>Recent activity</h3>
          <div className="activity-list">
            {stats.recent.length === 0 && <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Nothing logged yet.</p>}
            {stats.recent.map((t) => (
              <div className="activity-row" key={t.id}>
                <span
                  className="activity-dot"
                  style={{
                    background:
                      t.status === "Completed" ? "var(--success)" : t.status === "In Progress" ? "var(--teal)" : "var(--warning)",
                  }}
                />
                <span>
                  <strong>{t.employeeName}</strong> · {t.title} — <em style={{ fontStyle: "normal", color: "var(--text)", fontWeight: 600 }}>{t.status}</em>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
