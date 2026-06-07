import {
  IconGrid,
  IconUsers,
  IconAssign,
  IconBoard,
  IconUpdates,
  IconReports,
  IconSettings,
} from "../icons.jsx";
import logo from "../assets/logo-mark.svg";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: IconGrid },
  { id: "employees", label: "Employees", icon: IconUsers },
  { id: "assign", label: "Assign Tasks", icon: IconAssign },
  { id: "board", label: "Task Board", icon: IconBoard },
  { id: "updates", label: "Daily Updates", icon: IconUpdates },
  { id: "reports", label: "Reports", icon: IconReports },
  { id: "settings", label: "Settings", icon: IconSettings },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark"><img className="brand-burst" src={logo} alt="Command Center logo" /></div>
        <div className="sidebar-brand-text">
          <strong>Command Center</strong>
          <span>Employee Tasks</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Workspace</span>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sidebar-link${active === id ? " active" : ""}`}
            onClick={() => onNavigate(id)}
          >
            <span className="icon">
              <Icon />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <strong>Manager Workspace</strong>
        Track employees, assign work, and follow daily progress from one premium console.
      </div>
    </aside>
  );
}
