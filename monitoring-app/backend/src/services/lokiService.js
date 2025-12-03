const axios = require('axios');

const LOKI_URL = process.env.LOKI_URL || 'http://localhost:3100';

class LokiService {
  constructor() {
    this.client = axios.create({
      baseURL: LOKI_URL,
      timeout: 10000,
    });
  }

  // Query logs from Loki
  async queryLogs(query, limit = 100, start = null, end = null) {
    try {
      const params = {
        query: query || '{job=~".+"}',
        limit: limit,
      };

      if (start) params.start = start;
      if (end) params.end = end;

      const response = await this.client.get('/loki/api/v1/query_range', { params });
      
      return this.formatLokiResponse(response.data);
    } catch (error) {
      console.error('Error querying Loki:', error.message);
      throw new Error('Failed to fetch logs from Loki');
    }
  }

  // Query log range
  async queryRange(query, start, end, limit = 1000) {
    try {
      const params = {
        query: query || '{job=~".+"}',
        start: start || Date.now() - 3600000, // Default: last hour
        end: end || Date.now(),
        limit: limit,
      };

      const response = await this.client.get('/loki/api/v1/query_range', { params });
      return this.formatLokiResponse(response.data);
    } catch (error) {
      console.error('Error querying Loki range:', error.message);
      throw new Error('Failed to fetch log range from Loki');
    }
  }

  // Get labels from Loki
  async getLabels() {
    try {
      const response = await this.client.get('/loki/api/v1/labels');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching labels from Loki:', error.message);
      throw new Error('Failed to fetch labels from Loki');
    }
  }

  // Get label values
  async getLabelValues(label) {
    try {
      const response = await this.client.get(`/loki/api/v1/label/${label}/values`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching label values from Loki:', error.message);
      throw new Error('Failed to fetch label values from Loki');
    }
  }

  // Format Loki response to a consistent structure
  formatLokiResponse(data) {
    if (!data || !data.data || !data.data.result) {
      return { logs: [], stats: {} };
    }

    const logs = [];
    
    data.data.result.forEach(stream => {
      const labels = stream.stream || {};
      
      stream.values.forEach(([timestamp, line]) => {
        logs.push({
          timestamp: new Date(parseInt(timestamp) / 1000000), // Convert nanoseconds to milliseconds
          line: line,
          labels: labels,
        });
      });
    });

    return {
      logs: logs.sort((a, b) => b.timestamp - a.timestamp),
      stats: {
        totalLogs: logs.length,
        resultType: data.data.resultType,
      },
    };
  }

  // Push logs to Loki (for application logging)
  async pushLog(stream, message, timestamp = Date.now()) {
    try {
      const payload = {
        streams: [
          {
            stream: stream,
            values: [
              [String(timestamp * 1000000), message], // Convert to nanoseconds
            ],
          },
        ],
      };

      await this.client.post('/loki/api/v1/push', payload);
    } catch (error) {
      console.error('Error pushing log to Loki:', error.message);
      // Don't throw - logging should not break the application
    }
  }
}

module.exports = new LokiService();