'use client';

import { useState } from 'react';

interface FilterControlsProps {
  onFilterChange: (filters: {
    usernameKeyword?: string;
    bioKeyword?: string;
    maxFollowers?: number;
  }) => void;
}

export default function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [usernameKeyword, setUsernameKeyword] = useState('');
  const [bioKeyword, setBioKeyword] = useState('');
  const [maxFollowers, setMaxFollowers] = useState('');

  const handleFilterChange = () => {
    onFilterChange({
      usernameKeyword: usernameKeyword.trim() || undefined,
      bioKeyword: bioKeyword.trim() || undefined,
      maxFollowers: maxFollowers ? parseInt(maxFollowers) : undefined,
    });
  };

  const handleReset = () => {
    setUsernameKeyword('');
    setBioKeyword('');
    setMaxFollowers('');
    onFilterChange({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="username-filter" className="block text-sm font-medium mb-1">
            Username contains
          </label>
          <input
            id="username-filter"
            type="text"
            value={usernameKeyword}
            onChange={(e) => {
              setUsernameKeyword(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="e.g., tech"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="bio-filter" className="block text-sm font-medium mb-1">
            Bio contains
          </label>
          <input
            id="bio-filter"
            type="text"
            value={bioKeyword}
            onChange={(e) => {
              setBioKeyword(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="e.g., founder"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="followers-filter" className="block text-sm font-medium mb-1">
            Max followers
          </label>
          <input
            id="followers-filter"
            type="number"
            value={maxFollowers}
            onChange={(e) => {
              setMaxFollowers(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="e.g., 10000"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Show only accounts with fewer followers than this
          </p>
        </div>

        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Reset Filters
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-600">
        <p className="font-medium mb-1">Note:</p>
        <p>Filters only hide nodes visually. Anchor calculations remain unchanged.</p>
      </div>
    </div>
  );
}
