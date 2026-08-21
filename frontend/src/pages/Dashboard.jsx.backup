const metrics = [
  {
    key: "total",
    label: "TOTAL STREETLIGHTS",
    description: "Connected monitoring devices",
    target: "devices",
  },
  {
    key: "online",
    label: "ONLINE",
    description: "Currently reporting",
    target: "devices",
  },
  {
    key: "offline",
    label: "OFFLINE",
    description: "Not currently reporting",
    target: "devices",
  },
  {
    key: "healthy",
    label: "HEALTHY",
    description: "Normal operating condition",
    target: "devices",
  },
  {
    key: "warning",
    label: "WARNING",
    description: "Requires attention",
    target: "alerts",
  },
  {
    key: "critical",
    label: "CRITICAL",
    description: "Immediate attention required",
    target: "alerts",
  },
  {
    key: "alerts",
    label: "ACTIVE ALERTS",
    description: "Unresolved infrastructure alerts",
    target: "alerts",
  },
  {
    key: "energy",
    label: "ENERGY CONSUMPTION",
    description: "Reported energy usage",
    target: "analytics",
  },
];

function MetricCard({ label, description, target, onNavigate }) {
  return (
    <button
      className="metric-card"
      onClick={() => onNavigate(target)}
      type="button"
      title={`Open ${target}`}
    >
      <div className="metric-card-top">
        <span>{label}</span>
        <span className="metric-status">API</span>
      </div>

      <strong className="metric-value">—</strong>

      <p>{description}</p>

      <span className="metric-action">View →</span>
    </button>
  );
}

export default function Dashboard({ onNavigate }) {
  return (
    <section className="app-page">
      <div className="page-intro dashboard-intro">
        <div>
          <span className="page-kicker">CITY OPERATIONS CENTER</span>

          <h2>Infrastructure Dashboard</h2>

          <p>
            Real-time overview of the smart streetlight monitoring network.
          </p>
        </div>

        <div className="dashboard-live-status">
          <span className="status-dot warning"></span>
          <span>Waiting for backend data</span>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.key}
            label={metric.label}
            description={metric.description}
            target={metric.target}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">MONITORING</span>
              <h3>Device Map</h3>
            </div>

            <span className="integration-badge">API DATA</span>
          </div>

          <div className="integration-empty">
            <div className="integration-icon">⌖</div>

            <h4>Map ready for device data</h4>

            <p>
              Streetlight locations will appear here when the backend device
              endpoint is available.
            </p>

            <button
              className="dashboard-action"
              onClick={() => onNavigate("devices")}
              type="button"
            >
              View Devices →
            </button>
          </div>
        </section>

        <section className="panel dashboard-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ALERT CENTER</span>
              <h3>Active Alerts</h3>
            </div>

            <span className="integration-badge">API DATA</span>
          </div>

          <div className="integration-empty">
            <div className="integration-icon alert-icon">△</div>

            <h4>Alerts ready for integration</h4>

            <p>
              Real alerts will appear here when the backend alerts endpoint is
              available.
            </p>

            <button
              className="dashboard-action alert-action"
              onClick={() => onNavigate("alerts")}
              type="button"
            >
              Open Alerts →
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
