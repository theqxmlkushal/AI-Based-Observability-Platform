import React from 'react';
import { GRAFANA_DASHBOARD_URL } from '../../utils/constants';

const GrafanaEmbed = () => {
  return (
    <div className="bg-dark-900 border-2 border-primary-500 rounded-lg shadow-glow-yellow overflow-hidden">
      <div className="bg-black text-primary-400 px-6 py-3 border-b-2 border-primary-500">
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