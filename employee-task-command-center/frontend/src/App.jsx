import { useEffect, useMemo, useState } from "react";
import { NAV_ITEMS } from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import EmployeeForm from "./components/EmployeeForm.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskBoard from "./components/TaskBoard.jsx";
import TaskTable from "./components/TaskTable.jsx";
import DailyUpdates from "./components/DailyUpdates.jsx";
import Reports from "./components/Reports.jsx";
import ApiConsole from "./components/ApiConsole.jsx";
import { api } from "./api.js";
import { makeId } from "./ids.js";
import { IconAlert, IconCheck, IconBolt, IconAssign, IconUsers, IconReports } from "./icons.jsx";
import logo from "./assets/logo-mark.svg";

let toastSeq = 0;

function enrichTask(task, employees) {
  const employee = employees.find((e) => e.id === task.employee_id);
  return {
    ...task,
    employeeName: employee ? employee.name : "Unassigned",
    department: employee ? employee.department : "—",
  };
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  function pushToast(type, message) {
    const id = (toastSeq += 1);
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }

  useEffect(() => {
    let cancelled = false;
    let pollId = null;

    async function syncLiveData() {
      try {
        const [emps, tsks] = await Promise.all([api.getEmployees(), api.getTasks()]);
        if (cancelled) return;
        setEmployees(emps);
        setTasks(tsks.map((t) => enrichTask(t, emps)));
        setBackendOnline(true);
      } catch (err) {
        if (cancelled) return;
        setBackendOnline(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    syncLiveData();
    pollId = window.setInterval(syncLiveData, 1200);
    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
    };
  }, []);

  // ------------------------------------------------------------------
  // Mutations — try the live API first, gracefully fall back to local
  // state so the dashboard stays usable when FastAPI isn't running.
  // ------------------------------------------------------------------
  async function handleAddEmployee(form) {
    try {
      const result = await api.addEmployee(form);
      setEmployees((prev) => [...prev, result.employee]);
      setBackendOnline(true);
      pushToast("success", `${result.employee.name} added to the team.`);
    } catch (err) {
      if (backendOnline === false || /fetch|network|failed/i.test(err.message)) {
        const employee = { id: makeId("emp"), ...form };
        setEmployees((prev) => [...prev, employee]);
        setBackendOnline(false);
        pushToast("info", `${employee.name} saved locally — backend offline.`);
        return;
      }
      pushToast("error", err.message);
      throw err;
    }
  }

  async function handleAssignTask(form) {
    try {
      const result = await api.assignTask(form);
      setTasks((prev) => [...prev, enrichTask(result.task, employees)]);
      setBackendOnline(true);
      pushToast("success", `Task “${result.task.title}” assigned.`);
    } catch (err) {
      if (backendOnline === false || /fetch|network|failed/i.test(err.message)) {
        const task = { id: makeId("task"), ...form };
        setTasks((prev) => [...prev, enrichTask(task, employees)]);
        setBackendOnline(false);
        pushToast("info", `“${task.title}” saved locally — backend offline.`);
        return;
      }
      pushToast("error", err.message);
      throw err;
    }
  }

  async function handleStatusChange(task, status) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await api.updateTaskStatus(task.id, status);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
      pushToast("info", `Status for “${task.title}” updated locally — backend offline.`);
      return;
    }
    pushToast("success", `“${task.title}” moved to ${status}.`);
  }

  async function handleDeleteTask(task) {
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(task.id);
      setBackendOnline(true);
      pushToast("success", `“${task.title}” deleted.`);
    } catch {
      setBackendOnline(false);
      pushToast("info", `“${task.title}” removed locally — backend offline.`);
    }
  }

  useEffect(() => {
    const root = document.documentElement;
    let raf = null;

    function onMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--cx", `${e.clientX}px`);
        root.style.setProperty("--cy", `${e.clientY}px`);
        root.style.setProperty("--glow-strength", "1");
        raf = null;
      });
    }
    function onLeave() {
      root.style.setProperty("--glow-strength", "0");
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function handleNavigate(id) {
    setActive(id);
    const target = document.getElementById(id);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const topbarOffset = window.innerWidth <= 860 ? 86 : 118;
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY - topbarOffset;
    const distance = end - start;

    if (prefersReducedMotion) {
      window.scrollTo(0, end);
      return;
    }

    const duration = Math.min(980, Math.max(560, Math.abs(distance) * 0.42));
    const startedAt = performance.now();
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    function step(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      window.scrollTo(0, start + distance * easeOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const filteredEmployees = useMemo(() => {
    if (!query.trim()) return employees;
    const q = query.toLowerCase();
    return employees.filter((e) => `${e.name} ${e.department} ${e.role}`.toLowerCase().includes(q));
  }, [employees, query]);

  const filteredTasks = useMemo(() => {
    if (!query.trim()) return tasks;
    const q = query.toLowerCase();
    return tasks.filter((t) => `${t.title} ${t.employeeName} ${t.department}`.toLowerCase().includes(q));
  }, [tasks, query]);

  const heroStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    return [
      { label: "Employees", value: employees.length },
      { label: "Active tasks", value: inProgress },
      { label: "Completed", value: completed },
      { label: "Total tasks", value: total },
    ];
  }, [employees, tasks]);

  return (
    <div className="app-shell">
      <div className="bg-aurora" />
      <div className="cursor-glow" />

      <div className="main-col">
        <Header
          active={active}
          backendOnline={backendOnline}
          query={query}
          onNavigate={handleNavigate}
          onQueryChange={setQuery}
        />

        <div className="product-subnav">
          <span>Product</span>
          <span>/</span>
          <strong>Employee Task Command Center</strong>
          <button type="button" onClick={() => handleNavigate("dashboard")}>Explore here</button>
        </div>

        <section className="hero-section" id="top">
          <div className="hero-copy">
            <h1>Meet your task partner</h1>
            <p>Assign work, follow daily progress, and keep every employee task moving from one focused workspace.</p>

            <label className="hero-prompt">
              <input
                type="text"
                placeholder="How can I help you today?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="button" onClick={() => handleNavigate("assign")}>Assign task ↑</button>
            </label>

            <div className="hero-chips">
              <button type="button" onClick={() => handleNavigate("employees")}><IconUsers /> Employees</button>
              <button type="button" onClick={() => handleNavigate("assign")}><IconAssign /> Assign</button>
              <button type="button" onClick={() => handleNavigate("reports")}><IconReports /> Reports</button>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <svg className="hero-project-svg" viewBox="0 0 640 560" role="img" aria-label="Task command center illustration">
              <defs>
                <filter id="heroIconShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.38" />
                </filter>
              </defs>
              <g filter="url(#heroIconShadow)">
                <path className="hero-svg-line" d="M94 260C120 140 242 76 354 120C430 150 474 216 466 298" />
                <path className="hero-svg-line thin" d="M468 298C456 404 374 486 260 492C190 496 132 470 96 426" />
                <circle className="hero-svg-orb" cx="444" cy="144" r="64" />

                <rect className="hero-svg-panel" x="132" y="184" width="318" height="258" rx="34" />
                <path className="hero-svg-line" d="M176 246H370" />
                <path className="hero-svg-line" d="M176 314H344" />
                <path className="hero-svg-line" d="M176 382H308" />

                <circle className="hero-svg-check" cx="390" cy="246" r="23" />
                <path className="hero-svg-tick" d="M380 246l8 8l18-20" />
                <circle className="hero-svg-check" cx="364" cy="314" r="23" />
                <path className="hero-svg-tick" d="M354 314l8 8l18-20" />
                <circle className="hero-svg-check" cx="328" cy="382" r="23" />
                <path className="hero-svg-tick" d="M318 382l8 8l18-20" />

                <path className="hero-svg-line connector" d="M132 312H68C50 312 38 300 38 282V224" />
                <circle className="hero-svg-node" cx="38" cy="204" r="27" />
                <path className="hero-svg-person" d="M27 212c4-10 12-15 21-15s17 5 21 15" />
                <circle className="hero-svg-person-fill" cx="48" cy="190" r="8" />

                <path className="hero-svg-line connector" d="M450 336h58c22 0 40 18 40 40v52" />
                <rect className="hero-svg-small-card" x="500" y="426" width="92" height="72" rx="18" />
                <path className="hero-svg-tiny-line" d="M526 454h38M526 476h28" />
              </g>
            </svg>
          </div>
        </section>

        <main className="content">
          {!backendOnline && !loading && (
            <div className="offline-banner">
              <IconAlert />
              Backend connection unavailable. Please start the FastAPI server (uvicorn main:app --reload) — your changes are kept locally for now.
            </div>
          )}

          <section className="problem-map" aria-label="Command center capabilities">
            <div className="problem-list">
              <article>
                <IconUsers />
                <h3>Break down work together</h3>
                <p>Turn employees, priorities, dates, and statuses into a clear operating rhythm.</p>
              </article>
              <article>
                <IconAssign />
                <h3>Tackle the daily workload</h3>
                <p>Assign tasks, update progress, and remove completed or cancelled work without losing context.</p>
              </article>
              <article>
                <IconReports />
                <h3>Explore what is next</h3>
                <p>Use reports and daily updates to spot bottlenecks and keep the team moving.</p>
              </article>
            </div>
            <div className="network-graphic">
              <svg className="network-map-svg" viewBox="0 0 760 520" role="img" aria-label="Employee task command center capability map">
                <g className="network-lines">
                  <path d="M350.5 239.3L246 166" />
                  <path d="M380.5 224L382 102" />
                  <path d="M413.6 247L592 178" />
                  <path d="M415.8 263.7L632 286" />
                  <path d="M400.3 289.7L492 424" />
                  <path d="M353.4 284.3L238 390" />
                  <path d="M344.2 264.1L170 284" />
                </g>

                <g className="network-labels">
                  <text x="236" y="156" textAnchor="middle">Employees</text>
                  <text x="382" y="82" textAnchor="middle">API</text>
                  <text x="606" y="170" textAnchor="start">Tasks</text>
                  <text x="648" y="292" textAnchor="start">Priority</text>
                  <text x="504" y="448" textAnchor="middle">Reports</text>
                  <text x="224" y="414" textAnchor="middle">Updates</text>
                  <text x="148" y="290" textAnchor="middle">Daily Flow</text>
                </g>

                <image
                  className="network-center-mark"
                  href={logo}
                  x="344"
                  y="224"
                  width="72"
                  height="72"
                />
                <circle className="network-center-ring" cx="380" cy="260" r="36" fill="none" />
              </svg>
            </div>
          </section>

          <Dashboard employees={filteredEmployees} tasks={filteredTasks} />
          <section className="workflow-showcase">
            <div className="section-heading centered">
              <div>
                <h2>The AI-style command center for team work</h2>
                <p>Use the sections below to add teammates, delegate assignments, review progress, and inspect the FastAPI connection.</p>
              </div>
            </div>
            <div className="showcase-tabs">
              {NAV_ITEMS.slice(0, 6).map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" className={active === id ? "active" : ""} onClick={() => handleNavigate(id)}>
                  <Icon /> {label}
                </button>
              ))}
            </div>
          </section>
          <EmployeeForm onAddEmployee={handleAddEmployee} />
          <TaskForm employees={employees} onAssignTask={handleAssignTask} />
          <TaskBoard tasks={filteredTasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} />
          <TaskTable
            employees={employees}
            tasks={filteredTasks}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
          <DailyUpdates tasks={filteredTasks} />
          <Reports employees={employees} tasks={tasks} />
          <ApiConsole backendOnline={backendOnline} />

          <section className="cta-panel">
            <div>
              <h2>What task are you up against?</h2>
              <p>Search the workspace or jump straight into assigning the next piece of work.</p>
            </div>
            <label className="hero-prompt compact">
              <input
                type="text"
                placeholder="How can I help you today?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="button" onClick={() => handleNavigate("assign")}>Assign task ↑</button>
            </label>
          </section>

          <footer className="site-footer">
            <div>
              <div className="brand-lockup"><span className="brand-burst" />Command Center</div>
              <p>By your Employee Task Command Center project</p>
            </div>
            <div className="footer-stats">
              {heroStats.map((stat) => (
                <span key={stat.label}><strong>{stat.value}</strong>{stat.label}</span>
              ))}
            </div>
          </footer>
        </main>
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map(({ id, label, icon: Icon }) => (
          <button key={id} className={active === id ? "active" : ""} onClick={() => handleNavigate(id)}>
            <Icon />
            {label.split(" ")[0]}
          </button>
        ))}
      </nav>

      <div className="toast-stack">
        {toasts.map((t) => (
          <div className={`toast ${t.type}`} key={t.id}>
            {t.type === "success" && <IconCheck />}
            {t.type === "error" && <IconAlert />}
            {t.type === "info" && <IconBolt />}
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
