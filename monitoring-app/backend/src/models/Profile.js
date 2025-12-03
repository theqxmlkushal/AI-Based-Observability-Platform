const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  profileType: {
    type: String,
    enum: ['cpu', 'memory', 'heap', 'goroutines', 'custom'],
    required: true,
    index: true,
  },
  service: {
    type: String,
    default: 'backend',
    index: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  sampleRate: {
    type: Number,
    default: 100, // Hz
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  labels: {
    type: Map,
    of: String,
    default: {},
  },
  metadata: {
    cpuUsage: Number,
    memoryUsage: Number,
    heapUsed: Number,
    heapTotal: Number,
    external: Number,
    arrayBuffers: Number,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
profileSchema.index({ timestamp: -1, profileType: 1 });
profileSchema.index({ service: 1, timestamp: -1 });

module.exports = mongoose.model('Profile', profileSchema);