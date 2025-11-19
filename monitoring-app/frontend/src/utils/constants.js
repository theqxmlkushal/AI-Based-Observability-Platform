// monitoring-app/frontend/src/utils/constants.js
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || 'http://localhost:3002';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';

export const GRAFANA_DASHBOARD_UID = 'blog-api-main';
export const GRAFANA_DASHBOARD_URL = `${GRAFANA_URL}/d/${GRAFANA_DASHBOARD_UID}/blog-api-monitoring-dashboard?orgId=1&refresh=15s&kiosk=tv`;