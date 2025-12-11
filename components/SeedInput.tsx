'use client';

import { useState, useRef } from 'react';
import type { SavedAnalysis } from '@/lib/types';

interface SeedInputProps {
  onSubmit: (usernames: string[]) => void;
  onImport?: (analysis: SavedAnalysis) => void;
  isLoading?: boolean;
}

export default function SeedInput({ onSubmit, onImport, isLoading }: SeedInputProps) {
  const [inputs, setInputs] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setError('');
  };

  const handleAddField = () => {
    if (inputs.length >= 10) {
      setError('Maximum 10 usernames allowed');
      return;
    }
    setInputs([...inputs, '']);
    setError('');
  };

  const handleRemoveField = (index: number) => {
    if (inputs.length <= 1) {
      setError('At least 1 username is required');
      return;
    }
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    setError('');
  };

  const validateUsername = (username: string): boolean => {
    const cleaned = username.trim().replace('@', '');
    return cleaned.length > 0 && /^[a-zA-Z0-9._]+$/.test(cleaned);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usernames = inputs
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

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const analysis: SavedAnalysis = JSON.parse(text);

      // Validate structure
      if (!analysis.seeds || !analysis.results || !analysis.anchorThreshold) {
        setError('Invalid analysis file format');
        return;
      }

      if (onImport) {
        onImport(analysis);
      }
    } catch (err) {
      setError('Failed to read file. Please ensure it\'s a valid JSON file.');
      console.error('Import error:', err);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter 1-10 Instagram usernames (seeds)
          </label>
          <div className="space-y-3">
            {inputs.map((input, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      @
                    </span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={`username${index + 1}`}
                      className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        input && !validateUsername(input)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {inputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    disabled={isLoading}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove username"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {inputs.length < 10 && (
            <button
              type="button"
              onClick={handleAddField}
              disabled={isLoading}
              className="mt-3 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Another Username
            </button>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Enter one username per field. Usernames can contain letters, numbers, dots, and underscores.
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

      {onImport && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 to-purple-50 text-gray-500">
                Or
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleImportClick}
            disabled={isLoading}
            className="mt-4 w-full px-6 py-3 bg-white text-gray-800 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Import Previous Analysis
          </button>
        </div>
      )}
    </div>
  );
}
