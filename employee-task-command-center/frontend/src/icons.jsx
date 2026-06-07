// Minimal hand-rolled icon set (no external icon library required)
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconGrid = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5" />
    <circle cx="17" cy="8.5" r="2.6" />
    <path d="M15.5 14.7c2.1.3 3.7 1.8 4.2 4.3" />
  </svg>
);

export const IconAssign = (p) => (
  <svg {...base} {...p}>
    <path d="M9 11l2.2 2.2L15 9" />
    <rect x="4" y="4" width="16" height="16" rx="4" />
  </svg>
);

export const IconBoard = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4" width="17" height="16" rx="3" />
    <path d="M9 4v16M15 4v16" />
  </svg>
);

export const IconUpdates = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h10M4 18h13" />
    <circle cx="20" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconReports = (p) => (
  <svg {...base} {...p}>
    <path d="M5 19V9M11 19V5M17 19v-7" />
    <path d="M3 19h18" />
  </svg>
);

export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.9-1.4-2-3.4-2.2.8a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.2-.8-2 3.4L4.6 10.5a7.7 7.7 0 0 0 0 3l-1.9 1.4 2 3.4 2.2-.8a7.6 7.6 0 0 0 2.6 1.5L10 21.5h4l.5-2.5a7.6 7.6 0 0 0 2.6-1.5l2.2.8 2-3.4-1.9-1.4z" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...base} {...p} width={16} height={16}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-3.4-3.4" />
  </svg>
);

export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M6 9a6 6 0 1 1 12 0c0 5 1.5 6.5 1.5 6.5h-15S6 14 6 9z" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconTrash = (p) => (
  <svg {...base} {...p} width={16} height={16}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </svg>
);

export const IconArrowUp = (p) => (
  <svg {...base} {...p} width={14} height={14}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...base} {...p} width={16} height={16}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const IconAlert = (p) => (
  <svg {...base} {...p} width={18} height={18}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 2.7 17a1.7 1.7 0 0 0 1.5 2.6h15.6a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0z" />
  </svg>
);

export const IconBolt = (p) => (
  <svg {...base} {...p} width={16} height={16}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
);
