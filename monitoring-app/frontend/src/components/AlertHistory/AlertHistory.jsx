import React from 'react';
import { useAlerts } from '../../hooks/useAlerts';

const AlertHistory = () => {
  const { alerts, stats, loading, error } = useAlerts();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Alert History</h2>
        <p className="text-gray-500">Loading alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Alert History</h2>
        <p className="text-red-500">Error loading alerts: {error}</p>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusColor = (status) => {
    return status === 'firing' ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Alert History</h2>
          {stats && (
            <div className="flex space-x-4 text-sm">
              <span className="text-gray-600">
                Total: <span className="font-semibold">{stats.total}</span>
              </span>
              <span className="text-red-600">
                Firing: <span className="font-semibold">{stats.firing}</span>
              </span>
              <span className="text-green-600">
                Resolved: <span className="font-semibold">{stats.resolved}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No alerts recorded yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <div key={alert._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{alert.alertname}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                      <span className={`text-sm font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.summary || alert.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
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