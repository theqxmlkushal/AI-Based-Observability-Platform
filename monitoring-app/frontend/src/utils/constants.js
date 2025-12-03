export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:4000';
export const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3002';
export const GRAFANA_DASHBOARD_URL = import.meta.env.VITE_GRAFANA_DASHBOARD_URL || 'http://localhost:3002/d/monitoring';

// Alert severity levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
};

// Alert status
export const ALERT_STATUS = {
  FIRING: 'firing',
  RESOLVED: 'resolved',
};

// Log levels
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  CRITICAL: 'critical',
};

// Profile types
export const PROFILE_TYPES = {
  CPU: 'cpu',
  MEMORY: 'memory',
  HEAP: 'heap',
  GOROUTINES: 'goroutines',
  CUSTOM: 'custom',
};

// Time ranges for queries
export const TIME_RANGES = {
  LAST_15_MIN: { label: 'Last 15 minutes', value: 15 * 60 * 1000 },
  LAST_1_HOUR: { label: 'Last 1 hour', value: 60 * 60 * 1000 },
  LAST_6_HOURS: { label: 'Last 6 hours', value: 6 * 60 * 60 * 1000 },
  LAST_24_HOURS: { label: 'Last 24 hours', value: 24 * 60 * 60 * 1000 },
  LAST_7_DAYS: { label: 'Last 7 days', value: 7 * 24 * 60 * 60 * 1000 },
};

// Refresh intervals
export const REFRESH_INTERVALS = {
  OFF: { label: 'Off', value: null },
  FIVE_SECONDS: { label: '5s', value: 5000 },
  TEN_SECONDS: { label: '10s', value: 10000 },
  THIRTY_SECONDS: { label: '30s', value: 30000 },
  ONE_MINUTE: { label: '1m', value: 60000 },
};