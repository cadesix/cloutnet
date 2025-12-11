'use client';

import { useState } from 'react';

interface SeedInputProps {
  onSubmit: (usernames: string[]) => void;
  isLoading?: boolean;
}

export default function SeedInput({ onSubmit, isLoading }: SeedInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usernames = input
      .split(/[\n,]+/)
      .map((u) => u.trim().replace('@', ''))
      .filter((u) => u.length > 0);

    if (usernames.length < 1) {
      setError('Please enter at least 1 username');
      return;
    }

    if (usernames.length > 10) {
      setError('Maximum 10 usernames allowed');
      return;
    }

    const invalidUsernames = usernames.filter(
      (u) => !/^[a-zA-Z0-9._]+$/.test(u)
    );
    if (invalidUsernames.length > 0) {
      setError(`Invalid username format: ${invalidUsernames.join(', ')}`);
      return;
    }

    onSubmit(usernames);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="seeds"
            className="block text-sm font-medium mb-2"
          >
            Enter 1-10 Instagram usernames (seeds)
          </label>
          <textarea
            id="seeds"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="username1&#10;username2&#10;username3"
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 mt-2">
            Enter usernames separated by newlines or commas
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Network'}
        </button>
      </form>
    </div>
  );
}
