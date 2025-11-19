// monitoring-app\frontend\src\hooks\useWebSocket.js
import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Connecting...',
  });
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);

  useEffect(() => {
    const handleNewAlert = (alert) => {
      setRealtimeAlerts((prev) => [alert, ...prev].slice(0, 10)); // Keep last 10 alerts
    };

    const handleConnectionStatus = (status) => {
      setConnectionStatus(status);
    };

    const socket = connectWebSocket(handleNewAlert, handleConnectionStatus);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return { connectionStatus, realtimeAlerts };
};