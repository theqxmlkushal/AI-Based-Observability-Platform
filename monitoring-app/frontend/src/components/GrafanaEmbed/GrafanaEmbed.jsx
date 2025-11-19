import React from 'react';
import { GRAFANA_DASHBOARD_URL } from '../../utils/constants';

const GrafanaEmbed = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-3">
        <h2 className="text-xl font-semibold">Performance Metrics</h2>
      </div>
      <div className="relative" style={{ height: '800px' }}>
        <iframe
          src={GRAFANA_DASHBOARD_URL}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Dashboard"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default GrafanaEmbed;