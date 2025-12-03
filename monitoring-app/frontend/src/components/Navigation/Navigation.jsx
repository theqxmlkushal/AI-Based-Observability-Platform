import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'metrics', label: 'Metrics & Alerts', icon: '📊' },
    { id: 'logs', label: 'Logs', icon: '📝' },
    { id: 'profiles', label: 'Profiles', icon: '⚡' },
  ];

  return (
    <div className="bg-black border-b-2 border-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-primary-700 hover:text-primary-500 hover:border-primary-700'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;