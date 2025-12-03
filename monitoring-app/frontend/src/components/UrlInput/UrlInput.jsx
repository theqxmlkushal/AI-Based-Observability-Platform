import React, { useState } from 'react';

const UrlInput = () => {
  const [url, setUrl] = useState('http://localhost:5000');
  const [savedUrl, setSavedUrl] = useState('http://localhost:5000');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedUrl(url);
    console.log('Monitoring URL:', url);
  };

  return (
    <div className="bg-dark-900 border-2 border-primary-600 rounded-lg shadow-glow-yellow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-primary-400">Target Application</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter application URL"
          className="flex-1 px-4 py-2 bg-black border-2 border-primary-600 text-primary-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-primary-700"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-primary-500 text-black font-semibold rounded-lg hover:bg-primary-400 transition shadow-glow-yellow"
        >
          Save
        </button>
      </form>
      <div className="mt-4 text-sm text-primary-400">
        <span className="font-medium">Currently monitoring:</span>{' '}
        <span className="text-primary-300">{savedUrl}</span>
      </div>
    </div>
  );
};

export default UrlInput;