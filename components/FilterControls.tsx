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
  const [maxFollowers, setMaxFollowers] = useState<number>(100000);

  const handleFilterChange = () => {
    onFilterChange({
      usernameKeyword: usernameKeyword.trim() || undefined,
      bioKeyword: bioKeyword.trim() || undefined,
      maxFollowers: maxFollowers < 100000 ? maxFollowers : undefined,
    });
  };

  const handleReset = () => {
    setUsernameKeyword('');
    setBioKeyword('');
    setMaxFollowers(100000);
    onFilterChange({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="username-filter" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username-filter"
            type="text"
            value={usernameKeyword}
            onChange={(e) => {
              setUsernameKeyword(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="Filter by username"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="bio-filter" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <input
            id="bio-filter"
            type="text"
            value={bioKeyword}
            onChange={(e) => {
              setBioKeyword(e.target.value);
              setTimeout(handleFilterChange, 300);
            }}
            placeholder="Filter by bio"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex-1 min-w-[250px]">
          <label htmlFor="followers-filter" className="block text-sm font-medium mb-1">
            Max followers: {maxFollowers < 100000 ? maxFollowers.toLocaleString() : 'No limit'}
          </label>
          <input
            id="followers-filter"
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={maxFollowers}
            onChange={(e) => {
              setMaxFollowers(parseInt(e.target.value));
              setTimeout(handleFilterChange, 300);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50k</span>
            <span>100k</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
