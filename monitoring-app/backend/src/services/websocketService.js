let io;

const initWebSocket = (socketIO) => {
  io = socketIO;
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
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

module.exports = {
  initWebSocket,
  broadcastAlert,
};