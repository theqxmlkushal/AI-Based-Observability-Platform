import React, { useState } from 'react';

const UrlInput = () => {
  const [url, setUrl] = useState('http://localhost:5000');
  const [savedUrl, setSavedUrl] = useState('http://localhost:5000');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedUrl(url);
    // For now, just save locally. In Option 2, we'd send to backend
    console.log('Monitoring URL:', url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Target Application</h2>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter application URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Save
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-600">
        <span className="font-medium">Currently monitoring:</span>{' '}
        <span className="text-blue-600">{savedUrl}</span>
      </div>
    </div>
  );
};

export default UrlInput;