import React, { useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import GrafanaEmbed from '../GrafanaEmbed/GrafanaEmbed';
import AlertBanner from '../AlertBanner/AlertBanner';
import AlertHistory from '../AlertHistory/AlertHistory';
import UrlInput from '../UrlInput/UrlInput';

const Dashboard = () => {
  const { connectionStatus, realtimeAlerts } = useWebSocket();
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  // Add new alerts to visible list
  React.useEffect(() => {
    if (realtimeAlerts.length > 0) {
      const latestAlert = realtimeAlerts[0];
      setVisibleAlerts((prev) => [...prev, { ...latestAlert, id: Date.now() }]);
    }
  }, [realtimeAlerts]);

  const removeAlert = (id) => {
    setVisibleAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className={`px-4 py-2 rounded-lg text-sm ${
          connectionStatus.connected
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        <span className="font-semibold">WebSocket Status:</span>{' '}
        {connectionStatus.message}
      </div>

      {/* URL Input */}
      <UrlInput />

      {/* Real-time Alert Banners */}
      <div className="fixed top-20 right-4 z-50 w-96 space-y-2">
        {visibleAlerts.map((alert) => (
          <AlertBanner
            key={alert.id}
            alert={alert}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      {/* Grafana Dashboard */}
      <GrafanaEmbed />

      {/* Alert History */}
      <AlertHistory />
    </div>
  );
};

export default Dashboard;