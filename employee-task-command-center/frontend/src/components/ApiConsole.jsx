import Reveal from "./Reveal.jsx";
import { API_ENDPOINTS, BASE_URL } from "../api.js";

export default function ApiConsole({ backendOnline }) {
  return (
    <div className="section-block" id="settings">
      <Reveal as="div" className="section-heading">
        <div>
          <span className="label">Backend</span>
          <h2>API console &amp; status</h2>
          <p>The FastAPI service backing this dashboard — endpoint map, base URL, and live connection status.</p>
        </div>
      </Reveal>

      <Reveal as="div" className="console-card">
        <div className="console-head">
          <span className="console-dot red" />
          <span className="console-dot yellow" />
          <span className="console-dot green" />
          <span className="console-title">{BASE_URL} — employee_task_command_center.api</span>
        </div>

        {API_ENDPOINTS.map((ep) => (
          <div className="console-row" key={`${ep.method}-${ep.path}`}>
            <span className={`console-method ${ep.method}`}>{ep.method}</span>
            <span className="console-path">{ep.path}</span>
            <span className="console-desc">{ep.description}</span>
          </div>
        ))}

        <div className="console-status">
          <span className={`status-chip ${backendOnline ? "online" : "offline"}`}>
            <span className="pulse" />
            {backendOnline ? "FastAPI Connected" : "FastAPI Offline"}
          </span>
          <span>
            {backendOnline
              ? "Live data is flowing from the FastAPI in-memory store."
              : "Start the backend with “uvicorn main:app --reload” to sync live data."}
          </span>
        </div>
      </Reveal>
    </div>
  );
}
