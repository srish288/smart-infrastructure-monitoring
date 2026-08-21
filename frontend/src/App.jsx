import "./styles/final-layout-fix.css";
import { useState } from "react";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Alerts from "./pages/Alerts";
import Simulator from "./pages/Simulator";

function PagePlaceholder({ title, description }) {
  return (
    <section className="app-page">
      <div className="page-intro">
        <span className="page-kicker">SMART INFRASTRUCTURE</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="panel empty-panel">
        <div className="empty-panel-icon">◈</div>
        <h3>{title}</h3>
        <p>
          This frontend view is ready for real backend data integration.
        </p>
      </div>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "devices":
        return <Devices />;

      case "alerts":
        return <Alerts />;

      case "analytics":
        return (
          <PagePlaceholder
            title="Analytics"
            description="View historical infrastructure metrics and trends."
          />
        );

      case "simulator":
        return <Simulator />;

      case "dashboard":
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <AppShell
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppShell>
  );
}

export default App;
