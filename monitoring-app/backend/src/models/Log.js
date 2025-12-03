const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  level: {
    type: String,
    enum: ['debug', 'info', 'warn', 'error', 'critical'],
    default: 'info',
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    default: 'backend',
    index: true,
  },
  labels: {
    type: Map,
    of: String,
    default: {},
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  traceId: {
    type: String,
    index: true,
  },
  source: {
    type: String,
    default: 'application',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
logSchema.index({ timestamp: -1, level: 1 });
logSchema.index({ service: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);