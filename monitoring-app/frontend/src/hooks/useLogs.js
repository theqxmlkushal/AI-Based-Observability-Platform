import { useState, useEffect, useCallback } from 'react';
import { getLogs, getLogStats } from '../services/api';

export const useLogs = (autoRefresh = false, refreshInterval = 30000) => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLogs(
        filters.query,
        filters.limit || 100,
        filters.start,
        filters.end,
        filters.level,
        filters.service
      );
      
      if (response.success && response.data && response.data.logs) {
        setLogs(response.data.logs);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getLogStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Error fetching log stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [fetchLogs, fetchStats]);

  useEffect(() => {
    if (autoRefresh && refreshInterval) {
      const interval = setInterval(() => {
        fetchLogs();
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchLogs, fetchStats]);

  return {
    logs,
    stats,
    loading,
    error,
    fetchLogs,
    fetchStats,
  };
};