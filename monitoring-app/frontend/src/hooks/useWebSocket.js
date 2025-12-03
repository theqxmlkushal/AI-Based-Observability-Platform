import { useEffect, useState } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../services/websocket';

export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    message: 'Connecting...',
  });
  const [realtimeAlerts, setRealtimeAlerts] = useState([]);
  const [realtimeLogs, setRealtimeLogs] = useState([]);

  useEffect(() => {
    const handleNewAlert = (alert) => {
      setRealtimeAlerts((prev) => [alert, ...prev].slice(0, 10));
    };

    const handleConnectionStatus = (status) => {
      setConnectionStatus(status);
    };

    const handleNewLog = (log) => {
      setRealtimeLogs((prev) => [log, ...prev].slice(0, 50));
    };

    const socket = connectWebSocket(handleNewAlert, handleConnectionStatus, handleNewLog);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return { 
    connectionStatus, 
    realtimeAlerts,
    realtimeLogs,
  };
};