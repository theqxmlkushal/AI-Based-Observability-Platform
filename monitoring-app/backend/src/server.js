require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const alertRoutes = require('./routes/alerts');
const logRoutes = require('./routes/logs');
const profileRoutes = require('./routes/profiles');
const { initWebSocket } = require('./services/websocketService');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

console.log('alertRoutes:', alertRoutes);
console.log('logRoutes:', logRoutes);
console.log('profileRoutes:', profileRoutes);



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize WebSocket
initWebSocket(io);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Monitoring Backend API',
    status: 'running',
    endpoints: {
      alerts: '/api/alerts',
      logs: '/api/logs',
      profiles: '/api/profiles',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/alerts', alertRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server ready`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Alert webhook: http://localhost:${PORT}/api/alerts/webhook`);
      console.log(`Logs API: http://localhost:${PORT}/api/logs`);
      console.log(`Profiles API: http://localhost:${PORT}/api/profiles`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();