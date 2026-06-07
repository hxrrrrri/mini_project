import Reveal from "./Reveal.jsx";
import { IconUsers, IconBolt, IconCheck, IconAlert, IconArrowUp } from "../icons.jsx";

function StatCard({ tone, icon: Icon, value, label, trend, index }) {
  return (
    <Reveal className="stat-card-wrap" style={{ transitionDelay: `${index * 70}ms` }}>
      <div className={`stat-card tone-${tone}`}>
        <div className="stat-top">
          <span className="stat-icon">
            <Icon />
          </span>
          <span className="stat-trend">
            <IconArrowUp /> {trend}
          </span>
        </div>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
        <div className="stat-bar">
          <span style={{ transform: `scaleX(${Math.min(value / Math.max(value, 1), 1)})` }} />
        </div>
      </div>
    </Reveal>
  );
}

export default function Dashboard({ employees, tasks }) {
  const total = tasks.length;
  const active = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;

  const cards = [
    { tone: "coral", icon: IconUsers, value: employees.length, label: "Total Employees", trend: "Team" },
    { tone: "blue", icon: IconBolt, value: active, label: "Active Tasks", trend: "In progress" },
    { tone: "green", icon: IconCheck, value: completed, label: "Completed Tasks", trend: `${total ? Math.round((completed / total) * 100) : 0}%` },
    { tone: "navy", icon: IconAlert, value: pending, label: "Pending Tasks", trend: "Needs action" },
  ];

  const recentTasks = [...tasks].slice(-5).reverse();

  return (
    <div className="section-block" id="dashboard">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Overview</span>
          <h2>Command center pulse</h2>
          <p>A live snapshot of your team's workload — employees onboarded, tasks in motion, and what still needs attention.</p>
        </div>
      </Reveal>

      <div className="stat-grid">
        {cards.map((c, i) => (
          <StatCard key={c.label} {...c} index={i} />
        ))}
      </div>

      <Reveal as="div" className="glass-card">
        <h3 style={{ marginBottom: 16, fontSize: 16 }}>Recently assigned</h3>
        {recentTasks.length === 0 ? (
          <p style={{ color: "var(--text-faint)", fontSize: 13 }}>No tasks assigned yet — head to “Assign Tasks” to get the board moving.</p>
        ) : (
          <div className="activity-list">
            {recentTasks.map((t) => (
              <div className="activity-row" key={t.id}>
                <span
                  className="activity-dot"
                  style={{
                    background:
                      t.status === "Completed" ? "var(--success)" : t.status === "In Progress" ? "var(--teal)" : "var(--warning)",
                  }}
                />
                <span>
                  <strong>{t.title}</strong> assigned to <strong>{t.employeeName}</strong> · due {t.due_date}
                </span>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
