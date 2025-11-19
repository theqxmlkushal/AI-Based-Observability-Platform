import React, { useState, useEffect } from 'react';

const AlertBanner = ({ alert, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const severityColors = {
    critical: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const bgColor = severityColors[alert.severity] || 'bg-gray-500';

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 animate-slide-in flex items-center justify-between`}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg">🚨 {alert.alertname}</span>
          <span className="text-sm opacity-90">({alert.status})</span>
        </div>
        <p className="mt-1">{alert.summary || alert.description}</p>
        <p className="text-sm opacity-80 mt-1">
          {new Date(alert.receivedAt).toLocaleString()}
        </p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 text-2xl hover:opacity-75"
      >
        ×
      </button>
    </div>
  );
};

export default AlertBanner;