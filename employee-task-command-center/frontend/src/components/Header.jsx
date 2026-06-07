import { useEffect, useState } from "react";
import { IconSearch, IconBell } from "../icons.jsx";
import { NAV_ITEMS } from "./Sidebar.jsx";
import logo from "../assets/logo-mark.svg";

export default function Header({ active, backendOnline, query, onNavigate, onQueryChange }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
      <div className="brand-lockup" onClick={() => onNavigate("dashboard")} role="button" tabIndex={0}>
        <img className="brand-burst" src={logo} alt="Command Center logo" />
        Command Center
      </div>

      <nav className="topbar-nav" aria-label="Primary navigation">
        {NAV_ITEMS.slice(0, 6).map(({ id, label }) => (
          <button key={id} className={active === id ? "active" : ""} type="button" onClick={() => onNavigate(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <label className="search-bar">
          <IconSearch />
          <input
            type="text"
            placeholder="Search employees, tasks…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </label>

        <span className={`status-chip ${backendOnline ? "online" : "offline"}`}>
          <span className="pulse" />
          {backendOnline ? "Live API" : "Offline"}
        </span>

        <button className="icon-btn" type="button" aria-label="Notifications">
          <IconBell />
          <span className="dot" />
        </button>

        <button className="try-btn" type="button" onClick={() => onNavigate("assign")}>Assign Task</button>
      </div>
    </header>
  );
}
