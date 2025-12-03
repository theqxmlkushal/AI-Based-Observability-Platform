import { io } from 'socket.io-client';
import { WEBSOCKET_URL } from '../utils/constants';

let socket = null;

export const connectWebSocket = (onNewAlert, onConnectionStatus, onNewLog) => {
  if (socket) {
    return socket;
  }

  socket = io(WEBSOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('connection-status', (status) => {
    console.log('Connection status:', status);
    if (onConnectionStatus) {
      onConnectionStatus({ connected: true, message: status.message });
    }
  });

  socket.on('new-alert', (alert) => {
    console.log('New alert received:', alert);
    if (onNewAlert) {
      onNewAlert(alert);
    }
  });

  socket.on('new-log', (log) => {
    console.log('New log received:', log);
    if (onNewLog) {
      onNewLog(log);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
    if (onConnectionStatus) {
      onConnectionStatus({ connected: false, message: 'Connection error' });
    }
  });

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToLogs = (filters = {}) => {
  if (socket) {
    socket.emit('subscribe-logs', filters);
  }
};

export const unsubscribeFromLogs = () => {
  if (socket) {
    socket.emit('unsubscribe-logs');
  }
};

export const getSocket = () => socket;