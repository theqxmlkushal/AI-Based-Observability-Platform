let io;

const initWebSocket = (socketIO) => {
  io = socketIO;
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Subscribe to log streams
    socket.on('subscribe-logs', (filters) => {
      console.log('Client subscribed to logs:', socket.id, filters);
      socket.join('logs');
    });

    // Unsubscribe from log streams
    socket.on('unsubscribe-logs', () => {
      console.log('Client unsubscribed from logs:', socket.id);
      socket.leave('logs');
    });

    // Send a welcome message
    socket.emit('connection-status', {
      status: 'connected',
      message: 'WebSocket connection established',
    });
  });
};

const broadcastAlert = (alert) => {
  if (io) {
    console.log('Broadcasting alert to all clients:', alert.alertname);
    io.emit('new-alert', alert);
  } else {
    console.warn('WebSocket not initialized, cannot broadcast alert');
  }
};

const broadcastLog = (log) => {
  if (io) {
    console.log('Broadcasting log to subscribed clients:', log.level);
    io.to('logs').emit('new-log', log);
  } else {
    console.warn('WebSocket not initialized, cannot broadcast log');
  }
};

const broadcastProfile = (profile) => {
  if (io) {
    console.log('Broadcasting profile to all clients:', profile.profileType);
    io.emit('new-profile', profile);
  } else {
    console.warn('WebSocket not initialized, cannot broadcast profile');
  }
};

module.exports = {
  initWebSocket,
  broadcastAlert,
  broadcastLog,
  broadcastProfile,
};