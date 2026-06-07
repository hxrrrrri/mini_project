# Employee Task Command Center

🔗 **Live demo**: [frontend-flame-ten-68.vercel.app](https://frontend-flame-ten-68.vercel.app) (frontend on Vercel, backend on Render at [mini-project-f7aj.onrender.com](https://mini-project-f7aj.onrender.com))

A premium, full-stack mini project for managing employees, assigning tasks, and
tracking daily work — built as a single-page dashboard with a futuristic
productivity aesthetic (glassmorphism panels, gradient stat cards, animated
Kanban board, and a dark FastAPI console).

## Features

- **Dashboard Overview** — animated stat cards (employees, active/completed/pending
  tasks) with gradient accent lines, hover lift, and a recent-activity feed.
- **Add Employee** — validated form with inline success/error feedback.
- **Assign Task** — full task form (employee, description, dates, priority, status).
- **Task Board** — three-column Kanban (Pending / In Progress / Completed) with
  gradient-bordered cards, status dropdown, animated status-update flash, and a
  delete-confirmation modal.
- **Employee Task List** — filterable table (by employee, status, priority) that
  collapses into stacked cards on mobile.
- **Daily Work Updates** — a generated timeline of recent task activity with
  animated progress bars per employee.
- **Reports / Analytics** — completion donut, department-wise and priority-distribution
  bars, and a recent-activity feed — all built with plain CSS, no chart library.
- **API Console** — a dark, code-console styled card listing every FastAPI endpoint
  with a live "FastAPI Connected / Offline" status chip.
- **Live data mode** — the UI reads real records from FastAPI, polls for updates,
  and shows a backend-unavailable banner if the API cannot be reached.
- **Motion design** — scroll-reveal sections, animated gradient background blobs,
  card hover lift, button hover scale, sidebar hover slide, modal fade/scale, and
  slide-in toast notifications.

## Tools used

- **Frontend:** React 18 + Vite, hand-rolled CSS design system (no UI kit), inline SVG icon set
- **Backend:** FastAPI, Pydantic v2, Uvicorn, in-memory storage
- **Fonts:** Space Grotesk (display) / Inter (body)

## Project structure

```
employee-task-command-center/
├── frontend/        React + Vite dashboard
└── backend/         FastAPI service (in-memory store)
```

## How to run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000` with CORS enabled for the Vite dev server.
Interactive docs are available at `http://127.0.0.1:8000/docs`.

## How to run the frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs at `http://localhost:5173` and talks to the FastAPI server at
`http://127.0.0.1:8000`. It starts empty until real employees and tasks are
created, and it polls the API so changes appear without a manual refresh.

## API endpoints

| Method | Path                    | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/employees`            | Add a new employee                |
| GET    | `/employees`            | List all employees                |
| POST   | `/tasks`                | Assign a task to an employee      |
| GET    | `/tasks`                | List all tasks                    |
| GET    | `/tasks/{employee_id}`  | List tasks for one employee       |
| PUT    | `/tasks/{task_id}`      | Update a task's status            |
| DELETE | `/tasks/{task_id}`      | Delete a task record              |

All write endpoints validate input with Pydantic models and return descriptive
JSON messages; not-found and duplicate-ID cases return proper HTTP error codes.

## Deployment notes

- **Frontend:** `npm run build` produces a static bundle deployable to Netlify,
  Vercel, or GitHub Pages. Update `BASE_URL` in `src/api.js` to point at your
  deployed backend URL.
- **Backend:** run locally, or deploy on Render/Railway (in-memory
  storage resets on restart — swap in a database for production use).
