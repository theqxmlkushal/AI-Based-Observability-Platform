const axios = require('axios');

const PYROSCOPE_URL = process.env.PYROSCOPE_URL || 'http://localhost:4040';

class PyroscopeService {
  constructor() {
    this.client = axios.create({
      baseURL: PYROSCOPE_URL,
      timeout: 15000,
    });
  }

  // Query profile data
  async queryProfiles(query = '', from = null, until = null) {
    try {
      const params = {
        query: query || 'process_cpu:cpu:nanoseconds:cpu:nanoseconds',
      };

      if (from) params.from = from;
      if (until) params.until = until;

      const response = await this.client.get('/render', { params });
      return this.formatProfileResponse(response.data);
    } catch (error) {
      console.error('Error querying Pyroscope:', error.message);
      throw new Error('Failed to fetch profiles from Pyroscope');
    }
  }

  // Get available applications
  async getApplications() {
    try {
      const response = await this.client.get('/api/apps');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching applications from Pyroscope:', error.message);
      throw new Error('Failed to fetch applications from Pyroscope');
    }
  }

  // Get profile types for an application
  async getProfileTypes(appName) {
    try {
      const response = await this.client.get(`/api/apps/${appName}`);
      return response.data || {};
    } catch (error) {
      console.error('Error fetching profile types from Pyroscope:', error.message);
      throw new Error('Failed to fetch profile types from Pyroscope');
    }
  }

  // Capture current Node.js memory snapshot
  captureMemorySnapshot() {
    const memUsage = process.memoryUsage();
    return {
      timestamp: Date.now(),
      profileType: 'memory',
      data: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers,
      },
      metadata: {
        unit: 'bytes',
        uptime: process.uptime(),
      },
    };
  }

  // Capture CPU usage
  captureCPUProfile() {
    const cpuUsage = process.cpuUsage();
    return {
      timestamp: Date.now(),
      profileType: 'cpu',
      data: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      metadata: {
        unit: 'microseconds',
        uptime: process.uptime(),
      },
    };
  }

  // Format profile response
  formatProfileResponse(data) {
    return {
      profiles: data,
      captured: new Date().toISOString(),
    };
  }
}

module.exports = new PyroscopeService();