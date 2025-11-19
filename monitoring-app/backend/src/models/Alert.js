const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertname: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['critical', 'warning', 'info'],
    default: 'warning',
  },
  status: {
    type: String,
    enum: ['firing', 'resolved'],
    required: true,
  },
  description: String,
  summary: String,
  labels: {
    type: Map,
    of: String,
  },
  annotations: {
    type: Map,
    of: String,
  },
  startsAt: Date,
  endsAt: Date,
  receivedAt: {
    type: Date,
    default: Date.now,
  },
  fingerprint: String,
  generatorURL: String,
}, {
  timestamps: true,
});

// Index for faster queries
alertSchema.index({ status: 1, receivedAt: -1 });
alertSchema.index({ alertname: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);