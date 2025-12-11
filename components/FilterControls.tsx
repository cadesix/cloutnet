'use client';

import { useState, useEffect, useRef } from 'react';

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced effect for text inputs only
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onFilterChange({
        usernameKeyword: usernameKeyword.trim() || undefined,
        bioKeyword: bioKeyword.trim() || undefined,
        maxFollowers: maxFollowers < 100000 ? maxFollowers : undefined,
      });
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [usernameKeyword, bioKeyword, maxFollowers, onFilterChange]);

  const handleReset = () => {
    setUsernameKeyword('');
    setBioKeyword('');
    setMaxFollowers(100000);
  };

  return (
    <div className="bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="username-filter" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username-filter"
            type="text"
            value={usernameKeyword}
            onChange={(e) => setUsernameKeyword(e.target.value)}
            placeholder="Filter by username"
            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
            onChange={(e) => setBioKeyword(e.target.value)}
            placeholder="Filter by bio"
            className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
            onChange={(e) => setMaxFollowers(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50k</span>
            <span>100k</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
