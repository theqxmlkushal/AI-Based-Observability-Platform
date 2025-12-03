import React, { useState, useEffect } from 'react';
import { useLogs } from '../../hooks/useLogs';
import { LOG_LEVELS, TIME_RANGES, REFRESH_INTERVALS } from '../../utils/constants';
import { subscribeToLogs, unsubscribeFromLogs } from '../../services/websocket';
import { format } from 'date-fns';

const LogViewer = () => {
  const [filters, setFilters] = useState({
    level: '',
    service: '',
    search: '',
    timeRange: TIME_RANGES.LAST_1_HOUR.value,
    limit: 100,
  });
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_INTERVALS.TEN_SECONDS.value);
  const [realtimeLogs, setRealtimeLogs] = useState([]);
  const [isRealtime, setIsRealtime] = useState(false);

  const { logs, stats, loading, error, fetchLogs, fetchStats } = useLogs(
    refreshInterval !== null,
    refreshInterval
  );

  const [displayLogs, setDisplayLogs] = useState([]);

  useEffect(() => {
    if (isRealtime) {
      setDisplayLogs([...realtimeLogs, ...logs].slice(0, filters.limit));
    } else {
      setDisplayLogs(logs);
    }
  }, [logs, realtimeLogs, isRealtime, filters.limit]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const now = Date.now();
    const start = now - filters.timeRange;
    
    fetchLogs({
      level: filters.level || null,
      service: filters.service || null,
      start: start,
      end: now,
      limit: filters.limit,
    });
  };

  const toggleRealtime = () => {
    if (!isRealtime) {
      subscribeToLogs(filters);
      setIsRealtime(true);
    } else {
      unsubscribeFromLogs();
      setIsRealtime(false);
      setRealtimeLogs([]);
    }
  };

  useEffect(() => {
    const socket = window.socket;
    if (socket && isRealtime) {
      const handleNewLog = (log) => {
        setRealtimeLogs((prev) => [log, ...prev].slice(0, 50));
      };
      
      socket.on('new-log', handleNewLog);
      
      return () => {
        socket.off('new-log', handleNewLog);
      };
    }
  }, [isRealtime]);

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
      case 'critical':
        return 'text-red-400 bg-red-950 border-red-600';
      case 'warn':
        return 'text-primary-400 bg-primary-950 border-primary-600';
      case 'info':
        return 'text-blue-400 bg-blue-950 border-blue-600';
      case 'debug':
        return 'text-primary-600 bg-dark-800 border-primary-700';
      default:
        return 'text-primary-600 bg-dark-800 border-primary-700';
    }
  };

  const filteredLogs = displayLogs.filter((log) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.message?.toLowerCase().includes(searchLower) ||
        log.line?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary-400">Logs</h2>
          <p className="text-sm text-primary-600 mt-1">
            View and search application logs from Loki
          </p>
        </div>
        <button
          onClick={toggleRealtime}
          className={`px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
            isRealtime
              ? 'bg-green-900 text-green-400 border-green-500 hover:bg-green-800'
              : 'bg-dark-900 text-primary-400 border-primary-600 hover:bg-dark-800'
          }`}
        >
          {isRealtime ? '🔴 Live' : '▶️ Start Live'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-dark-900 border-2 border-primary-600 p-4 rounded-lg shadow-glow-yellow">
            <div className="text-sm text-primary-600">Total Logs</div>
            <div className="text-2xl font-bold text-primary-400">{stats.total}</div>
          </div>
          <div className="bg-dark-900 border-2 border-red-600 p-4 rounded-lg">
            <div className="text-sm text-red-600">Errors</div>
            <div className="text-2xl font-bold text-red-400">
              {stats.byLevel?.error || 0}
            </div>
          </div>
          <div className="bg-dark-900 border-2 border-primary-600 p-4 rounded-lg">
            <div className="text-sm text-primary-600">Warnings</div>
            <div className="text-2xl font-bold text-primary-400">
              {stats.byLevel?.warn || 0}
            </div>
          </div>
          <div className="bg-dark-900 border-2 border-blue-600 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Info</div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.byLevel?.info || 0}
            </div>
          </div>
          <div className="bg-dark-900 border-2 border-primary-600 p-4 rounded-lg">
            <div className="text-sm text-primary-600">Recent (1h)</div>
            <div className="text-2xl font-bold text-primary-400">
              {stats.recentLogs || 0}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-dark-900 border-2 border-primary-600 p-6 rounded-lg shadow-glow-yellow">
        <h3 className="text-lg font-semibold text-primary-400 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Log Level Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              Log Level
            </label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Levels</option>
              {Object.entries(LOG_LEVELS).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              Service
            </label>
            <input
              type="text"
              value={filters.service}
              onChange={(e) => handleFilterChange('service', e.target.value)}
              placeholder="Enter service name"
              className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500 placeholder-primary-700"
            />
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(TIME_RANGES).map(([key, { label, value }]) => (
                <option key={key} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Interval */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              Auto Refresh
            </label>
            <select
              value={refreshInterval || ''}
              onChange={(e) => setRefreshInterval(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(REFRESH_INTERVALS).map(([key, { label, value }]) => (
                <option key={key} value={value || ''}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-400 transition-colors shadow-glow-yellow"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-primary-400 mb-2">
            Search Logs
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search in log messages..."
            className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500 placeholder-primary-700"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-950 border-2 border-red-600 text-red-400 px-4 py-3 rounded-lg">
          <div className="font-medium">Error loading logs</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-dark-900 border-2 border-primary-600 p-8 rounded-lg shadow-glow-yellow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-primary-400">Loading logs...</p>
        </div>
      )}

      {/* Logs Display */}
      {!loading && (
        <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow">
          <div className="p-4 border-b-2 border-primary-600 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-400">
              Log Entries ({filteredLogs.length})
            </h3>
            {isRealtime && (
              <span className="flex items-center text-sm text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Live Updates Active
              </span>
            )}
          </div>
          
          <div className="overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-primary-600">
                No logs found matching the current filters
              </div>
            ) : (
              <div className="divide-y divide-primary-900">
                {filteredLogs.map((log, index) => {
                  const timestamp = log.timestamp || new Date();
                  const level = log.level || log.labels?.level || 'info';
                  const message = log.message || log.line || 'No message';
                  
                  return (
                    <div
                      key={index}
                      className="p-4 hover:bg-dark-800 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Timestamp */}
                        <div className="text-xs text-primary-600 font-mono whitespace-nowrap">
                          {format(new Date(timestamp), 'HH:mm:ss.SSS')}
                        </div>

                        {/* Level Badge */}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded border ${getLogLevelColor(
                            level
                          )}`}
                        >
                          {level.toUpperCase()}
                        </span>

                        {/* Service */}
                        {(log.service || log.labels?.service) && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-950 text-purple-400 border border-purple-600 rounded">
                            {log.service || log.labels?.service}
                          </span>
                        )}

                        {/* Message */}
                        <div className="flex-1 text-sm text-primary-300 font-mono break-all">
                          {message}
                        </div>
                      </div>

                      {/* Labels */}
                      {log.labels && Object.keys(log.labels).length > 0 && (
                        <div className="mt-2 ml-24 flex flex-wrap gap-2">
                          {Object.entries(log.labels).map(([key, value]) => (
                            <span
                              key={key}
                              className="text-xs text-primary-600 bg-dark-800 border border-primary-700 px-2 py-1 rounded"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogViewer;