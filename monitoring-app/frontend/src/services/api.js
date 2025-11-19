//monitoring-app\frontend\src\services\api.js
import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAlertHistory = async (limit = 50, status = null, severity = null) => {
  try {
    const params = { limit };
    if (status) params.status = status;
    if (severity) params.severity = severity;

    const response = await api.get('/api/alerts/history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching alert history:', error);
    throw error;
  }
};

export const getAlertStats = async () => {
  try {
    const response = await api.get('/api/alerts/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching alert stats:', error);
    throw error;
  }
};

export const getHealthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Error fetching health check:', error);
    throw error;
  }
};

export default api;