import React, { useState, useEffect } from 'react';
import { useProfiles } from '../../hooks/useProfiles';
import { PROFILE_TYPES, TIME_RANGES, REFRESH_INTERVALS } from '../../utils/constants';
import { captureSnapshot } from '../../services/api';
import { format } from 'date-fns';

const ProfileViewer = () => {
  const [filters, setFilters] = useState({
    profileType: '',
    service: '',
    timeRange: TIME_RANGES.LAST_1_HOUR.value,
    limit: 50,
  });
  const [refreshInterval, setRefreshInterval] = useState(REFRESH_INTERVALS.THIRTY_SECONDS.value);
  const [capturingSnapshot, setCapturingSnapshot] = useState(false);

  const { profiles, stats, loading, error, fetchProfiles, fetchStats } = useProfiles(
    refreshInterval !== null,
    refreshInterval
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - filters.timeRange);
    
    fetchProfiles({
      profileType: filters.profileType || null,
      service: filters.service || null,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      limit: filters.limit,
    });
  };

  const handleCaptureSnapshot = async (type) => {
    setCapturingSnapshot(true);
    try {
      await captureSnapshot(type);
      await fetchProfiles();
      await fetchStats();
    } catch (err) {
      console.error('Error capturing snapshot:', err);
    } finally {
      setCapturingSnapshot(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatMicroseconds = (microseconds) => {
    return (microseconds / 1000000).toFixed(2) + 's';
  };

  const getProfileTypeColor = (type) => {
    switch (type) {
      case 'cpu':
        return 'text-purple-400 bg-purple-950 border-purple-600';
      case 'memory':
        return 'text-green-400 bg-green-950 border-green-600';
      case 'heap':
        return 'text-blue-400 bg-blue-950 border-blue-600';
      default:
        return 'text-primary-600 bg-dark-800 border-primary-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary-400">Profiles</h2>
          <p className="text-sm text-primary-600 mt-1">
            View and analyze application performance profiles
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleCaptureSnapshot('memory')}
            disabled={capturingSnapshot}
            className="px-4 py-2 bg-green-900 text-green-400 border-2 border-green-600 rounded-lg hover:bg-green-800 transition-colors font-medium disabled:bg-dark-800 disabled:text-primary-700 disabled:border-primary-800"
          >
            {capturingSnapshot ? 'Capturing...' : '📊 Capture Memory'}
          </button>
          <button
            onClick={() => handleCaptureSnapshot('cpu')}
            disabled={capturingSnapshot}
            className="px-4 py-2 bg-purple-900 text-purple-400 border-2 border-purple-600 rounded-lg hover:bg-purple-800 transition-colors font-medium disabled:bg-dark-800 disabled:text-primary-700 disabled:border-primary-800"
          >
            {capturingSnapshot ? 'Capturing...' : '⚡ Capture CPU'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-900 border-2 border-primary-600 p-4 rounded-lg shadow-glow-yellow">
            <div className="text-sm text-primary-600">Total Profiles</div>
            <div className="text-2xl font-bold text-primary-400">{stats.total}</div>
          </div>
          <div className="bg-dark-900 border-2 border-purple-600 p-4 rounded-lg">
            <div className="text-sm text-purple-600">CPU Profiles</div>
            <div className="text-2xl font-bold text-purple-400">
              {stats.byType?.cpu || 0}
            </div>
          </div>
          <div className="bg-dark-900 border-2 border-green-600 p-4 rounded-lg">
            <div className="text-sm text-green-600">Memory Profiles</div>
            <div className="text-2xl font-bold text-green-400">
              {stats.byType?.memory || 0}
            </div>
          </div>
          <div className="bg-dark-900 border-2 border-primary-600 p-4 rounded-lg">
            <div className="text-sm text-primary-600">Recent (1h)</div>
            <div className="text-2xl font-bold text-primary-400">
              {stats.recentProfiles || 0}
            </div>
          </div>
        </div>
      )}

      {/* Latest Snapshots */}
      {stats?.latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latest Memory */}
          {stats.latest.memory && (
            <div className="bg-dark-900 border-2 border-green-600 p-6 rounded-lg shadow-glow-yellow">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                Latest Memory Snapshot
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">RSS:</span>
                  <span className="font-medium text-primary-400">
                    {formatBytes(stats.latest.memory.data.rss)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Heap Total:</span>
                  <span className="font-medium text-primary-400">
                    {formatBytes(stats.latest.memory.data.heapTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Heap Used:</span>
                  <span className="font-medium text-primary-400">
                    {formatBytes(stats.latest.memory.data.heapUsed)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">External:</span>
                  <span className="font-medium text-primary-400">
                    {formatBytes(stats.latest.memory.data.external)}
                  </span>
                </div>
                <div className="text-xs text-primary-700 mt-4 font-mono">
                  Captured: {format(new Date(stats.latest.memory.timestamp), 'PPpp')}
                </div>
              </div>
            </div>
          )}

          {/* Latest CPU */}
          {stats.latest.cpu && (
            <div className="bg-dark-900 border-2 border-purple-600 p-6 rounded-lg shadow-glow-yellow">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">
                Latest CPU Snapshot
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">User CPU Time:</span>
                  <span className="font-medium text-primary-400">
                    {formatMicroseconds(stats.latest.cpu.data.user)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">System CPU Time:</span>
                  <span className="font-medium text-primary-400">
                    {formatMicroseconds(stats.latest.cpu.data.system)}
                  </span>
                </div>
                <div className="text-xs text-primary-700 mt-4 font-mono">
                  Captured: {format(new Date(stats.latest.cpu.timestamp), 'PPpp')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-dark-900 border-2 border-primary-600 p-6 rounded-lg shadow-glow-yellow">
        <h3 className="text-lg font-semibold text-primary-400 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Profile Type Filter */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              Profile Type
            </label>
            <select
              value={filters.profileType}
              onChange={(e) => handleFilterChange('profileType', e.target.value)}
              className="w-full px-3 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Types</option>
              {Object.entries(PROFILE_TYPES).map(([key, value]) => (
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
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-950 border-2 border-red-600 text-red-400 px-4 py-3 rounded-lg">
          <div className="font-medium">Error loading profiles</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-dark-900 border-2 border-primary-600 p-8 rounded-lg shadow-glow-yellow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-primary-400">Loading profiles...</p>
        </div>
      )}

      {/* Profiles Display */}
      {!loading && (
        <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow">
          <div className="p-4 border-b-2 border-primary-600">
            <h3 className="text-lg font-semibold text-primary-400">
              Profile History ({profiles.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            {profiles.length === 0 ? (
              <div className="p-8 text-center text-primary-600">
                No profiles found matching the current filters
              </div>
            ) : (
              <div className="divide-y divide-primary-900">
                {profiles.map((profile, index) => (
                  <div
                    key={profile._id || index}
                    className="p-4 hover:bg-dark-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {/* Type Badge */}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded border ${getProfileTypeColor(
                              profile.profileType
                            )}`}
                          >
                            {profile.profileType.toUpperCase()}
                          </span>

                          {/* Service */}
                          <span className="px-2 py-1 text-xs font-medium bg-purple-950 text-purple-400 border border-purple-600 rounded">
                            {profile.service}
                          </span>

                          {/* Timestamp */}
                          <span className="text-sm text-primary-600 font-mono">
                            {format(new Date(profile.timestamp), 'PPpp')}
                          </span>
                        </div>

                        {/* Profile Data */}
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                          {profile.profileType === 'memory' && profile.data && (
                            <>
                              <div>
                                <div className="text-xs text-primary-600">RSS</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatBytes(profile.data.rss)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-primary-600">Heap Used</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatBytes(profile.data.heapUsed)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-primary-600">Heap Total</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatBytes(profile.data.heapTotal)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-primary-600">External</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatBytes(profile.data.external)}
                                </div>
                              </div>
                            </>
                          )}

                          {profile.profileType === 'cpu' && profile.data && (
                            <>
                              <div>
                                <div className="text-xs text-primary-600">User CPU</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatMicroseconds(profile.data.user)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-primary-600">System CPU</div>
                                <div className="text-sm font-medium text-primary-400">
                                  {formatMicroseconds(profile.data.system)}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileViewer;