let connection = null;

export function connectRealtime({
  url,
  onMessage,
  onError,
  onStatusChange,
} = {}) {
  if (!url) {
    onStatusChange?.("unavailable");
    return () => {};
  }

  try {
    connection = new WebSocket(url);

    connection.onopen = () => {
      onStatusChange?.("connected");
    };

    connection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        onMessage?.(event.data);
      }
    };

    connection.onerror = (error) => {
      onStatusChange?.("error");
      onError?.(error);
    };

    connection.onclose = () => {
      onStatusChange?.("disconnected");
    };

    return () => {
      if (connection) {
        connection.close();
        connection = null;
      }
    };
  } catch (error) {
    onStatusChange?.("error");
    onError?.(error);
    return () => {};
  }
}

export function disconnectRealtime() {
  if (connection) {
    connection.close();
    connection = null;
  }
}
