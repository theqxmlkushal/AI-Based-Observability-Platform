import { useState, useEffect, useCallback } from 'react';
import { getProfileHistory, getProfileStats } from '../services/api';

export const useProfiles = (autoRefresh = false, refreshInterval = 30000) => {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfiles = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfileHistory(
        filters.limit || 50,
        filters.profileType,
        filters.service,
        filters.startDate,
        filters.endDate
      );
      
      if (response.success) {
        setProfiles(response.profiles);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch profiles');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getProfileStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Error fetching profile stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
    fetchStats();
  }, [fetchProfiles, fetchStats]);

  useEffect(() => {
    if (autoRefresh && refreshInterval) {
      const interval = setInterval(() => {
        fetchProfiles();
        fetchStats();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchProfiles, fetchStats]);

  return {
    profiles,
    stats,
    loading,
    error,
    fetchProfiles,
    fetchStats,
  };
};