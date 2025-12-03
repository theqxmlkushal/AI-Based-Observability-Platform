import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAlerts } from '../../hooks/useAlerts';
import AlertBanner from '../AlertBanner/AlertBanner';
import AlertHistory from '../AlertHistory/AlertHistory';
import GrafanaEmbed from '../GrafanaEmbed/GrafanaEmbed';
import UrlInput from '../UrlInput/UrlInput';

const Dashboard = () => {
  const { connectionStatus, realtimeAlerts } = useWebSocket();
  const [grafanaUrl, setGrafanaUrl] = useState('');
  const [showGrafana, setShowGrafana] = useState(false);

  const handleUrlSubmit = (url) => {
    setGrafanaUrl(url);
    setShowGrafana(true);
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className={`p-5 rounded-xl border-2 transition-all duration-300 ${
          connectionStatus.connected
            ? 'bg-dark-900 border-primary-500 shadow-glow-yellow'
            : 'bg-dark-900 border-primary-700'
        }`}
      >
        <div className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full mr-3 ${
              connectionStatus.connected 
                ? 'bg-primary-500 animate-pulse-glow' 
                : 'bg-primary-700 animate-pulse'
            }`}
          ></div>
          <span className="font-semibold text-primary-400 text-lg">
            {connectionStatus.message}
          </span>
        </div>
      </div>

      {/* Real-time Alert Banner */}
      {realtimeAlerts.length > 0 && <AlertBanner alerts={realtimeAlerts} />}

      {/* URL Input */}
      {!showGrafana && <UrlInput onSubmit={handleUrlSubmit} />}

      {/* Grafana Dashboard */}
      {showGrafana && grafanaUrl && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center bg-dark-900 p-5 rounded-xl border-2 border-primary-500">
            <h2 className="text-2xl font-bold text-primary-400">Grafana Dashboard</h2>
            <button
              onClick={() => setShowGrafana(false)}
              className="px-5 py-2.5 bg-black text-primary-400 rounded-lg hover:bg-dark-800 hover:shadow-glow-yellow border-2 border-primary-500 transition-all duration-300 font-medium"
            >
              Change URL
            </button>
          </div>
          <GrafanaEmbed url={grafanaUrl} />
        </div>
      )}

      {/* Alert History */}
      <AlertHistory />
    </div>
  );
};

export default Dashboard;