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

  const severityStyles = {
    critical: {
      bg: 'bg-dark-900',
      border: 'border-primary-500',
      icon: '🔥',
      accent: 'bg-primary-500',
      text: 'text-primary-400',
    },
    warning: {
      bg: 'bg-dark-800',
      border: 'border-primary-600',
      icon: '⚠️',
      accent: 'bg-primary-600',
      text: 'text-primary-500',
    },
    info: {
      bg: 'bg-dark-800',
      border: 'border-primary-700',
      icon: 'ℹ️',
      accent: 'bg-primary-700',
      text: 'text-primary-600',
    },
  };

  const style = severityStyles[alert.severity] || severityStyles.info;

  return (
    <div
      className={`${style.bg} border-2 ${style.border} rounded-xl shadow-glow-yellow px-6 py-5 mb-4 animate-slide-in relative overflow-hidden`}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accent}`}></div>
      
      <div className="flex items-start justify-between ml-2">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{style.icon}</span>
            <span className={`font-bold text-xl ${style.text}`}>
              {alert.alertname}
            </span>
            <span className={`text-sm px-2 py-1 rounded-md bg-dark-700 ${style.text} border border-dark-600`}>
              {alert.status}
            </span>
          </div>
          <p className="mt-3 text-dark-100 leading-relaxed">
            {alert.summary || alert.description}
          </p>
          <p className="text-sm text-dark-300 mt-2 font-mono">
            {new Date(alert.receivedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`ml-4 text-2xl ${style.text} hover:text-primary-300 transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-700`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;