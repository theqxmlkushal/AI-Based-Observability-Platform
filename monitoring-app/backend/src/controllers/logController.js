const Log = require('../models/Log');
const lokiService = require('../services/lokiService');
const { broadcastLog } = require('../services/websocketService');

// Get logs from Loki
exports.getLogs = async (req, res) => {
  try {
    const { 
      query = '{job=~".+"}', 
      limit = 100, 
      start, 
      end,
      level,
      service 
    } = req.query;

    // Build LogQL query based on filters
    let lokiQuery = query;
    
    if (level || service) {
      const filters = [];
      if (level) filters.push(`level="${level}"`);
      if (service) filters.push(`service="${service}"`);
      lokiQuery = `{job=~".+"} | json | ${filters.join(' | ')}`;
    }

    const result = await lokiService.queryLogs(
      lokiQuery,
      parseInt(limit),
      start ? parseInt(start) : null,
      end ? parseInt(end) : null
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch logs',
      message: error.message 
    });
  }
};

// Get log range (time-based query)
exports.getLogRange = async (req, res) => {
  try {
    const { 
      query = '{job=~".+"}',
      start,
      end,
      limit = 1000
    } = req.query;

    const result = await lokiService.queryRange(
      query,
      start ? parseInt(start) : Date.now() - 3600000, // Default: last hour
      end ? parseInt(end) : Date.now(),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching log range:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch log range',
      message: error.message 
    });
  }
};

// Get available labels from Loki
exports.getLabels = async (req, res) => {
  try {
    const labels = await lokiService.getLabels();
    res.json({
      success: true,
      data: labels,
    });
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch labels',
      message: error.message 
    });
  }
};

// Get label values
exports.getLabelValues = async (req, res) => {
  try {
    const { label } = req.params;
    const values = await lokiService.getLabelValues(label);
    res.json({
      success: true,
      data: values,
    });
  } catch (error) {
    console.error('Error fetching label values:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch label values',
      message: error.message 
    });
  }
};

// Get logs from MongoDB (backup/historical)
exports.getLogHistory = async (req, res) => {
  try {
    const { 
      limit = 50, 
      level, 
      service,
      startDate,
      endDate 
    } = req.query;

    const query = {};
    if (level) query.level = level;
    if (service) query.service = service;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    console.error('Error fetching log history:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Get log statistics
exports.getLogStats = async (req, res) => {
  try {
    const total = await Log.countDocuments();
    const error = await Log.countDocuments({ level: 'error' });
    const warn = await Log.countDocuments({ level: 'warn' });
    const info = await Log.countDocuments({ level: 'info' });
    const debug = await Log.countDocuments({ level: 'debug' });

    // Get recent logs count (last hour)
    const oneHourAgo = new Date(Date.now() - 3600000);
    const recentLogs = await Log.countDocuments({ 
      timestamp: { $gte: oneHourAgo } 
    });

    res.json({
      success: true,
      stats: {
        total,
        byLevel: {
          error,
          warn,
          info,
          debug,
        },
        recentLogs,
      },
    });
  } catch (error) {
    console.error('Error fetching log stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Create a log entry (for testing or manual logging)
exports.createLog = async (req, res) => {
  try {
    const { level, message, service, labels, metadata } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    const log = await Log.create({
      level: level || 'info',
      message,
      service: service || 'backend',
      labels: labels || {},
      metadata: metadata || {},
    });

    // Broadcast to WebSocket clients
    broadcastLog(log);

    // Push to Loki
    await lokiService.pushLog(
      { 
        job: 'monitoring-backend',
        level: log.level,
        service: log.service 
      },
      JSON.stringify({
        message: log.message,
        timestamp: log.timestamp,
        ...log.metadata
      }),
      log.timestamp.getTime()
    );

    res.status(201).json({
      success: true,
      log,
    });
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};