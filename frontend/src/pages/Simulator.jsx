export default function Simulator() {
  return (
    <section className="app-page">
      <div className="page-intro">
        <span className="page-kicker">SIMULATION CONTROL</span>

        <h2>Simulator</h2>

        <p>
          Control and monitor the streetlight simulator when backend simulator
          endpoints are available.
        </p>
      </div>

      <section className="panel simulator-panel">
        <div className="simulator-status">
          <span className="status-dot warning"></span>

          <div>
            <strong>Simulator controls unavailable</strong>

            <p>
              Backend simulator endpoints are not available yet. Controls will
              be enabled automatically when the backend integration is ready.
            </p>
          </div>
        </div>

        <div className="simulator-controls-disabled">
          <button disabled>START</button>
          <button disabled>STOP</button>
          <button disabled>PAUSE</button>
          <button disabled>RESUME</button>
        </div>

        <div className="simulator-info-grid">
          <div>
            <span>DEVICE COUNT</span>
            <strong>—</strong>
          </div>

          <div>
            <span>SIMULATION SPEED</span>
            <strong>—</strong>
          </div>

          <div>
            <span>FAULT SELECTION</span>
            <strong>—</strong>
          </div>

          <div>
            <span>DEVICE SELECTION</span>
            <strong>—</strong>
          </div>
        </div>
      </section>
    </section>
  );
}
