import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';

const AlertHistory = () => {
  const { alerts, stats, loading, error } = useAlerts();

  if (loading) {
    return (
      <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary-400">Alert History</h2>
        <p className="text-primary-600">Loading alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary-400">Alert History</h2>
        <p className="text-red-500">Error loading alerts: {error}</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-950 border-red-600';
      case 'warning':
        return 'text-primary-400 bg-primary-950 border-primary-600';
      default:
        return 'text-blue-400 bg-blue-950 border-blue-600';
    }
  };

  const getStatusColor = (status) => {
    return status === 'firing' ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow">
      <div className="px-6 py-4 border-b-2 border-primary-600">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary-400">Alert History</h2>
          {stats && (
            <div className="flex space-x-4 text-sm">
              <span className="text-primary-400">
                Total: <span className="font-semibold text-primary-300">{stats.total}</span>
              </span>
              <span className="text-primary-400">
                Firing: <span className="font-semibold text-red-400">{stats.firing}</span>
              </span>
              <span className="text-primary-400">
                Resolved: <span className="font-semibold text-green-400">{stats.resolved}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-primary-600">
            No alerts recorded yet
          </div>
        ) : (
          <div className="divide-y divide-primary-900">
            {alerts.map((alert) => (
              <div key={alert._id} className="p-4 hover:bg-dark-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-primary-300">{alert.alertname}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded border ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-primary-400 mt-1">
                      {alert.summary || alert.description}
                    </p>
                    <p className="text-xs text-primary-600 mt-1 font-mono">
                      {new Date(alert.receivedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertHistory;