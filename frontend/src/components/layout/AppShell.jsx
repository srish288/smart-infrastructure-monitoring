import { useState } from "react";
import {
  LayoutDashboard,
  Lightbulb,
  TriangleAlert,
  BarChart3,
  PlayCircle,
} from "lucide-react";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "devices", label: "Devices", icon: Lightbulb },
  { id: "alerts", label: "Alerts", icon: TriangleAlert },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "simulator", label: "Simulator", icon: PlayCircle },
];

export default function AppShell({
  activePage,
  onNavigate,
  children,
}) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Operations Manager");
  const [showBackendStatus, setShowBackendStatus] = useState(false);
  const [adminPanel, setAdminPanel] = useState(null);

  return (
    <div
      className={`app-shell ${
        darkMode ? "theme-dark" : "theme-light"
      } ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div className="brand-mark">SI</div>

          {!sidebarCollapsed && (
            <div className="brand-text">
              <strong>SmartInfra</strong>
              <span>MONITORING SYSTEM</span>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => {
            setSidebarCollapsed((value) => {
              const nextValue = !value;

              if (nextValue) {
                setShowBackendStatus(false);
                setShowAdminMenu(false);
              }

              return nextValue;
            });
          }}
        >
          {sidebarCollapsed ? "›" : "‹"}
        </button>

        <div className="sidebar-section">
          <span className="sidebar-label">MONITORING</span>

          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">
                  <item.icon
                    size={19}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>

                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            type="button"
            className="connection-status connection-button"
            onClick={() => setShowBackendStatus((value) => !value)}
          >
            <span className="connection-dot"></span>

            {!sidebarCollapsed && (
              <div>
                <strong>System Status</strong>
                <small>API integration pending</small>
              </div>
            )}
          </button>

          {showBackendStatus && !sidebarCollapsed && (
            <div className="status-popover">
              <div className="popover-title">
                Backend Connection
              </div>

              <div className="status-row">
                <span>REST API</span>
                <strong className="status-pending">
                  Pending
                </strong>
              </div>

              <div className="status-row">
                <span>Real-time</span>
                <strong className="status-pending">
                  Pending
                </strong>
              </div>

              <p>
                Live device and telemetry data will appear after
                the backend integration is available.
              </p>
            </div>
          )}

          <div className="admin-wrapper">
            <button
              type="button"
              className="user-area user-button"
              onClick={() => {
                if (sidebarCollapsed) {
                  setSidebarCollapsed(false);
                  setShowAdminMenu(true);
                } else {
                  setShowAdminMenu((value) => !value);
                }
              }}
            >
              <div className="user-avatar">AD</div>

              {!sidebarCollapsed && (
                <div>
                  <strong>Admin</strong>
                  <small>Operations Manager</small>
                </div>
              )}
            </button>

            {showAdminMenu && !sidebarCollapsed && (
            <div className="admin-menu">
              {!editingAdmin ? (
                <>
                  <div className="admin-profile">
                    <div className="user-avatar large">AD</div>

                    <div className="admin-profile-info">
                      <strong>{adminName}</strong>
                      <span>{adminRole}</span>
                    </div>

                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() => setEditingAdmin(true)}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="admin-menu-divider"></div>

                  <div className="admin-profile-grid">
                    <div>
                      <small>ROLE</small>
                      <strong>{adminRole}</strong>
                    </div>

                    <div>
                      <small>ACCESS</small>
                      <strong>Administrator</strong>
                    </div>

                    <div>
                      <small>STATUS</small>
                      <strong className="admin-active-status">
                        <span></span>
                        Active
                      </strong>
                    </div>

                    <div>
                      <small>SYSTEM</small>
                      <strong>SmartInfra</strong>
                    </div>
                  </div>

                  <div className="admin-menu-divider"></div>

                  <div className="profile-status">
                    <span className="connection-dot"></span>
                    <span>Dashboard access active</span>
                  </div>
                </>
              ) : (
                <div className="admin-edit-panel">
                  <div className="admin-edit-header">
                    <div>
                      <small>ACCOUNT</small>
                      <h3>Edit Profile</h3>
                    </div>

                    <button
                      type="button"
                      className="admin-close-edit"
                      onClick={() => setEditingAdmin(false)}
                    >
                      ×
                    </button>
                  </div>

                  <label>
                    <span>Name</span>
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Enter name"
                    />
                  </label>

                  <label>
                    <span>Role</span>
                    <input
                      type="text"
                      value={adminRole}
                      onChange={(e) => setAdminRole(e.target.value)}
                      placeholder="Enter role"
                    />
                  </label>

                  <div className="admin-edit-actions">
                    <button
                      type="button"
                      className="admin-cancel-button"
                      onClick={() => setEditingAdmin(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="admin-save-button"
                      onClick={() => setEditingAdmin(false)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>

          {adminPanel && !sidebarCollapsed && (
            <div className="admin-detail-panel">
              {adminPanel === "profile" && (
                <>
                  <div className="admin-detail-header">
                    <div>
                      <span className="admin-detail-eyebrow">ACCOUNT</span>
                      <h3>Profile</h3>
                    </div>
                    <button
                      type="button"
                      className="admin-close"
                      onClick={() => setAdminPanel(null)}
                      aria-label="Close profile"
                    >
                      ×
                    </button>
                  </div>

                  <div className="admin-profile-card">
                    <div className="admin-profile-avatar">AD</div>
                    <div>
                      <strong>Admin</strong>
                      <span>Operations Manager</span>
                    </div>
                  </div>

                  <div className="admin-info-grid">
                    <div>
                      <span>ROLE</span>
                      <strong>Operations Manager</strong>
                    </div>
                    <div>
                      <span>ACCESS</span>
                      <strong>Administrator</strong>
                    </div>
                    <div>
                      <span>STATUS</span>
                      <strong className="admin-online">
                        <i></i> Active
                      </strong>
                    </div>
                    <div>
                      <span>SYSTEM</span>
                      <strong>SmartInfra</strong>
                    </div>
                  </div>
                </>
              )}

              {adminPanel === "preferences" && (
                <>
                  <div className="admin-detail-header">
                    <div>
                      <span className="admin-detail-eyebrow">WORKSPACE</span>
                      <h3>Preferences</h3>
                    </div>
                    <button
                      type="button"
                      className="admin-close"
                      onClick={() => setAdminPanel(null)}
                      aria-label="Close preferences"
                    >
                      ×
                    </button>
                  </div>

                  <div className="preference-group">
                    <div>
                      <strong>Appearance</strong>
                      <small>Choose dashboard appearance</small>
                    </div>

                    <div className="preference-buttons">
                      <button
                        type="button"
                        className={!darkMode ? "selected" : ""}
                        onClick={() => setDarkMode(false)}
                      >
                        ☀ Day
                      </button>

                      <button
                        type="button"
                        className={darkMode ? "selected" : ""}
                        onClick={() => setDarkMode(true)}
                      >
                        ☾ Night
                      </button>
                    </div>
                  </div>

                  <div className="preference-group">
                    <div>
                      <strong>Sidebar</strong>
                      <small>Control navigation width</small>
                    </div>

                    <button
                      type="button"
                      className="preference-action"
                      onClick={() => setSidebarCollapsed((value) => !value)}
                    >
                      {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    </button>
                  </div>

                  <div className="preference-group">
                    <div>
                      <strong>Live monitoring</strong>
                      <small>Backend integration status</small>
                    </div>

                    <span className="preference-status">
                      <i></i> Ready for integration
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <div>
            <span className="header-overline">
              CITY OPERATIONS
            </span>

            <h1>Smart Infrastructure</h1>
          </div>

          <div className="header-actions">
            <div className="header-status">
              <span className="status-dot pending"></span>
              <span>API integration pending</span>
            </div>

            <div className="theme-toggle">
              <button
                type="button"
                className={!darkMode ? "selected" : ""}
                onClick={() => setDarkMode(false)}
              >
                ☀ <span>Day</span>
              </button>

              <button
                type="button"
                className={darkMode ? "selected" : ""}
                onClick={() => setDarkMode(true)}
              >
                ☾ <span>Night</span>
              </button>
            </div>
          </div>
        </header>

        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}
