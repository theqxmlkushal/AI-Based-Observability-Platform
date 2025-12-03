import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import LogViewer from './components/LogViewer/LogViewer';
import ProfileViewer from './components/ProfileViewer/ProfileViewer';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';

function App() {
  const [activeTab, setActiveTab] = useState('metrics');
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Connecting...',
  });

  useEffect(() => {
    // Initialize WebSocket connection
    const handleNewAlert = (alert) => {
      setRealtimeAlerts((prev) => [alert, ...prev].slice(0, 10));
    };

    const handleConnectionStatus = (status) => {
      setConnectionStatus(status);
    };

    const handleNewLog = (log) => {
      console.log('New log received in App:', log);
      // Logs are handled by LogViewer component
    };

    const socket = connectWebSocket(handleNewAlert, handleConnectionStatus, handleNewLog);
    
    // Store socket globally for components to access
    window.socket = socket;

    return () => {
      disconnectWebSocket();
      window.socket = null;
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'metrics':
        return <Dashboard />;
      case 'logs':
        return <LogViewer />;
      case 'profiles':
        return <ProfileViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </Layout>
  );
}

export default App;