//monitoring-app\frontend\src\hooks\useAlerts.js
import { useState, useEffect } from 'react';
import { getAlertHistory, getAlertStats } from '../services/api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getAlertHistory();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAlertStats();
      setStats(data.stats || null);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts();
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { alerts, stats, loading, error, refetch: fetchAlerts };
};