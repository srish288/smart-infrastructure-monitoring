const telemetryFields = [
  "Voltage",
  "Current",
  "Power",
  "Temperature",
  "Illumination",
];

function DataPlaceholder({ label }) {
  return (
    <div className="device-data-item">
      <span>{label}</span>
      <strong>—</strong>
    </div>
  );
}

export default function Devices() {
  return (
    <section className="app-page">
      <div className="page-intro">
        <span className="page-kicker">DEVICE MONITORING</span>

        <h2>Streetlight Devices</h2>

        <p>
          Monitor device status, source and live infrastructure telemetry.
        </p>
      </div>

      <div className="devices-layout">
        <section className="panel device-map-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">LOCATION MONITORING</span>
              <h3>Device Map</h3>
            </div>

            <div className="map-legend">
              <span><i className="legend-dot healthy"></i>Healthy</span>
              <span><i className="legend-dot warning"></i>Warning</span>
              <span><i className="legend-dot critical"></i>Critical</span>
              <span><i className="legend-dot offline"></i>Offline</span>
            </div>
          </div>

          <div className="map-placeholder">
            <div className="map-grid"></div>

            <div className="map-message">
              <div className="integration-icon">⌖</div>

              <h4>Map ready for backend locations</h4>

              <p>
                Streetlight markers will be rendered from the real device API.
              </p>
            </div>
          </div>
        </section>

        <section className="panel device-details-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">DEVICE DETAILS</span>
              <h3>Selected Device</h3>
            </div>
          </div>

          <div className="selected-device-empty">
            <div className="integration-icon">◉</div>

            <h4>No device selected</h4>

            <p>
              Select a device marker to view its live status and telemetry.
            </p>
          </div>

          <div className="telemetry-grid">
            {telemetryFields.map((field) => (
              <DataPlaceholder key={field} label={field} />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
