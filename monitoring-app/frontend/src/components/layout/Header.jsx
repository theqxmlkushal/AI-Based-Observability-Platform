import React from 'react';

const Header = () => {
  return (
    <header className="bg-black border-b-2 border-primary-500">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shadow-glow-yellow">
              <span className="text-black font-bold text-xl">M</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-500">
              Monitoring Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-primary-400 font-medium">
                Live
              </span>
            </div>
            <span className="text-sm text-primary-400 font-mono bg-dark-900 px-3 py-1 rounded-md border border-primary-600">
              {new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;