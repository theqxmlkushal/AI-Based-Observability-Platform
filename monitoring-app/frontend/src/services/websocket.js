// monitoring-app\frontend\src\services\websocket.js
import { io } from 'socket.io-client';
import { WS_URL } from '../utils/constants';

let socket = null;

export const connectWebSocket = (onAlert, onConnectionStatus) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(WS_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
    if (onConnectionStatus) {
      onConnectionStatus({ connected: true, message: 'Connected to server' });
    }
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
    if (onConnectionStatus) {
      onConnectionStatus({ connected: false, message: 'Disconnected from server' });
    }
  });

  socket.on('connection-status', (data) => {
    console.log('Connection status:', data);
    if (onConnectionStatus) {
      onConnectionStatus({ connected: true, message: data.message });
    }
  });

  socket.on('new-alert', (alert) => {
    console.log('New alert received:', alert);
    if (onAlert) {
      onAlert(alert);
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

export const getSocket = () => socket;