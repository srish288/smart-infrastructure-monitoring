import { useMemo, useState } from "react";

const EMPTY_ALERTS = [];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "acknowledged", label: "Acknowledged" },
  { id: "resolved", label: "Resolved" },
];

export default function Alerts() {
  const [activeFilter, setActiveFilter] = useState("all");

  /*
   * Backend integration is not connected yet.
   * Keep this empty rather than inventing infrastructure alerts.
   */
  const alerts = EMPTY_ALERTS;

  const counts = useMemo(() => {
    return {
      all: alerts.length,
      critical: alerts.filter(
        (alert) => String(alert.severity).toLowerCase() === "critical"
      ).length,
      warning: alerts.filter(
        (alert) => String(alert.severity).toLowerCase() === "warning"
      ).length,
      acknowledged: alerts.filter(
        (alert) => alert.acknowledged === true
      ).length,
      resolved: alerts.filter(
        (alert) => alert.resolved === true
      ).length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    switch (activeFilter) {
      case "critical":
        return alerts.filter(
          (alert) =>
            String(alert.severity).toLowerCase() === "critical"
        );

      case "warning":
        return alerts.filter(
          (alert) =>
            String(alert.severity).toLowerCase() === "warning"
        );

      case "acknowledged":
        return alerts.filter(
          (alert) => alert.acknowledged === true
        );

      case "resolved":
        return alerts.filter(
          (alert) => alert.resolved === true
        );

      default:
        return alerts;
    }
  }, [activeFilter, alerts]);

  return (
    <section className="alerts-page">
      <div className="alerts-page-heading">
        <div>
          <span className="alerts-eyebrow">
            INCIDENT MANAGEMENT
          </span>

          <h2>Alerts</h2>

          <p>
            Review and manage infrastructure alerts reported by the
            monitoring system.
          </p>
        </div>

        <div className="alerts-live-status">
          <span />
          Backend connected when available
        </div>
      </div>

      <section className="alerts-panel">
        <div className="alerts-toolbar">
          <div className="alerts-filter-bar">
            {FILTERS.map((filter) => {
              const count = counts[filter.id];

              return (
                <button
                  key={filter.id}
                  type="button"
                  className={`alert-filter ${
                    activeFilter === filter.id ? "active" : ""
                  } ${
                    filter.id !== "all"
                      ? `alert-filter-${filter.id}`
                      : ""
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                >
                  {filter.id === "critical" && (
                    <span className="alert-filter-dot critical" />
                  )}

                  {filter.id === "warning" && (
                    <span className="alert-filter-dot warning" />
                  )}

                  {filter.id === "acknowledged" && (
                    <span className="alert-filter-dot acknowledged" />
                  )}

                  {filter.id === "resolved" && (
                    <span className="alert-filter-dot resolved" />
                  )}

                  <span>{filter.label}</span>

                  <strong>{count}</strong>
                </button>
              );
            })}
          </div>

          <span className="alerts-api-badge">
            API DATA
          </span>
        </div>

        <div className="alerts-content">
          {filteredAlerts.length === 0 ? (
            <div className="alerts-empty">
              <div className="alerts-empty-icon">
                <span>△</span>
              </div>

              <span className="alerts-empty-label">
                {activeFilter === "all"
                  ? "MONITORING STATUS"
                  : `${activeFilter.toUpperCase()} ALERTS`}
              </span>

              <h3>
                No alerts available
              </h3>

              <p>
                {activeFilter === "all"
                  ? "Real infrastructure alerts will appear here when the backend alerts endpoint is connected."
                  : `There are currently no ${activeFilter} alerts.`}
              </p>

              <div className="alerts-empty-status">
                <span />
                Waiting for backend alert data
              </div>
            </div>
          ) : (
            <div className="alerts-list">
              {filteredAlerts.map((alert) => (
                <article
                  className="alert-card"
                  key={alert.id}
                >
                  <div className="alert-card-indicator" />

                  <div className="alert-card-main">
                    <div className="alert-card-top">
                      <span className="alert-severity">
                        {alert.severity}
                      </span>

                      <span className="alert-time">
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3>
                      {alert.type || alert.title}
                    </h3>

                    <p>
                      {alert.message || alert.description}
                    </p>

                    <div className="alert-card-meta">
                      <span>
                        Device: {alert.deviceId || alert.asset}
                      </span>

                      <span>
                        {alert.device || alert.location}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
