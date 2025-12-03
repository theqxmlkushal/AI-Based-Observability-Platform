import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== ALERTS ==========
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

// ========== LOGS ==========
export const getLogs = async (query = null, limit = 100, start = null, end = null, level = null, service = null) => {
  try {
    const params = { limit };
    if (query) params.query = query;
    if (start) params.start = start;
    if (end) params.end = end;
    if (level) params.level = level;
    if (service) params.service = service;

    const response = await api.get('/api/logs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};

export const getLogRange = async (query = null, start = null, end = null, limit = 1000) => {
  try {
    const params = { limit };
    if (query) params.query = query;
    if (start) params.start = start;
    if (end) params.end = end;

    const response = await api.get('/api/logs/range', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching log range:', error);
    throw error;
  }
};

export const getLogLabels = async () => {
  try {
    const response = await api.get('/api/logs/labels');
    return response.data;
  } catch (error) {
    console.error('Error fetching log labels:', error);
    throw error;
  }
};

export const getLabelValues = async (label) => {
  try {
    const response = await api.get(`/api/logs/labels/${label}/values`);
    return response.data;
  } catch (error) {
    console.error('Error fetching label values:', error);
    throw error;
  }
};

export const getLogHistory = async (limit = 50, level = null, service = null, startDate = null, endDate = null) => {
  try {
    const params = { limit };
    if (level) params.level = level;
    if (service) params.service = service;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/api/logs/history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching log history:', error);
    throw error;
  }
};

export const getLogStats = async () => {
  try {
    const response = await api.get('/api/logs/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching log stats:', error);
    throw error;
  }
};

export const createLog = async (logData) => {
  try {
    const response = await api.post('/api/logs', logData);
    return response.data;
  } catch (error) {
    console.error('Error creating log:', error);
    throw error;
  }
};

// ========== PROFILES ==========
export const getProfiles = async (query = null, from = null, until = null) => {
  try {
    const params = {};
    if (query) params.query = query;
    if (from) params.from = from;
    if (until) params.until = until;

    const response = await api.get('/api/profiles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const response = await api.get('/api/profiles/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const getProfileTypes = async (appName) => {
  try {
    const response = await api.get(`/api/profiles/applications/${appName}/types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile types:', error);
    throw error;
  }
};

export const captureSnapshot = async (type = 'memory') => {
  try {
    const response = await api.post('/api/profiles/snapshot', { type });
    return response.data;
  } catch (error) {
    console.error('Error capturing snapshot:', error);
    throw error;
  }
};

export const getProfileHistory = async (limit = 50, profileType = null, service = null, startDate = null, endDate = null) => {
  try {
    const params = { limit };
    if (profileType) params.profileType = profileType;
    if (service) params.service = service;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/api/profiles/history', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile history:', error);
    throw error;
  }
};

export const getProfileStats = async () => {
  try {
    const response = await api.get('/api/profiles/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    throw error;
  }
};

// ========== HEALTH ==========
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