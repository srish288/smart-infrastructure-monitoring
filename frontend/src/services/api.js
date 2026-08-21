const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export const api = {
  getDashboard: () => request("/api/dashboard"),

  getDevices: () => request("/api/devices"),

  getDevice: (deviceId) =>
    request(`/api/devices/${encodeURIComponent(deviceId)}`),

  getDeviceHistory: (deviceId) =>
    request(`/api/devices/${encodeURIComponent(deviceId)}/history`),

  getAlerts: () => request("/api/alerts"),

  acknowledgeAlert: (alertId) =>
    request(`/api/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
      method: "PATCH",
    }),

  resolveAlert: (alertId) =>
    request(`/api/alerts/${encodeURIComponent(alertId)}/resolve`, {
      method: "PATCH",
    }),

  getSimulatorStatus: () => request("/api/simulator/status"),

  startSimulator: () =>
    request("/api/simulator/start", {
      method: "POST",
    }),

  stopSimulator: () =>
    request("/api/simulator/stop", {
      method: "POST",
    }),

  pauseSimulator: () =>
    request("/api/simulator/pause", {
      method: "POST",
    }),

  resumeSimulator: () =>
    request("/api/simulator/resume", {
      method: "POST",
    }),
};
