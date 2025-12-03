import { useState, useEffect, useCallback } from 'react';
import { getAlertHistory, getAlertStats } from '../services/api';

export const useAlerts = (autoRefresh = false, refreshInterval = 30000) => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async (limit = 50, status = null, severity = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAlertHistory(limit, status, severity);
      if (response.success) {
        setAlerts(response.alerts);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getAlertStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Error fetching alert stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [fetchAlerts, fetchStats]);

  useEffect(() => {
    if (autoRefresh && refreshInterval) {
      const interval = setInterval(() => {
        fetchAlerts();
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchAlerts, fetchStats]);

  return {
    alerts,
    stats,
    loading,
    error,
    fetchAlerts,
    fetchStats,
  };
};