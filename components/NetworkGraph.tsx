'use client';

import { useState, useMemo } from 'react';
import type { UserNode, Edge } from '@/lib/types';
import { clusterByWeight, applyFilters } from '@/lib/graph';
import { countAnchorsFollowing } from '@/lib/calculations';
import UserNodeComponent from './UserNode';
import FilterControls from './FilterControls';

interface NetworkGraphProps {
  users: UserNode[];
  edges: Edge[];
  anchorThreshold: number;
  seeds: string[];
}

export default function NetworkGraph({
  users,
  edges,
  anchorThreshold,
  seeds,
}: NetworkGraphProps) {
  const [filters, setFilters] = useState<{
    usernameKeyword?: string;
    bioKeyword?: string;
    maxFollowers?: number;
  }>({});
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const toggleUserSelection = (username: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const clustered = useMemo(() => {
    return clusterByWeight(users, anchorThreshold);
  }, [users, anchorThreshold]);

  const anchorUsernames = useMemo(() => {
    return new Set(clustered.anchors.map((u) => u.username));
  }, [clustered.anchors]);

  const filtered = useMemo(() => {
    return {
      anchors: applyFilters(clustered.anchors, filters),
      highWeight: applyFilters(clustered.highWeight, filters),
      longTail: applyFilters(clustered.longTail, filters),
    };
  }, [clustered, filters]);

  const totalVisible =
    filtered.anchors.length + filtered.highWeight.length + filtered.longTail.length;

  const getAnchorCount = (username: string): number => {
    return countAnchorsFollowing(username, edges, anchorUsernames);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-2">Analysis Results</h2>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-600">Seeds:</span>{' '}
            <span className="font-semibold">{seeds.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Anchor Threshold:</span>{' '}
            <span className="font-semibold">{anchorThreshold}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Users:</span>{' '}
            <span className="font-semibold">{users.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Visible:</span>{' '}
            <span className="font-semibold">{totalVisible}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <FilterControls onFilterChange={setFilters} />
      </div>

      <div className="space-y-6">
        {filtered.anchors.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold">Anchors</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {filtered.anchors.length} users
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Followed by {anchorThreshold}+ seeds (~40% of seeds)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.anchors.map((user) => (
                  <UserNodeComponent
                    key={user.username}
                    user={user}
                    anchorCount={getAnchorCount(user.username)}
                    isSelected={selectedUsers.has(user.username)}
                    onToggleSelect={toggleUserSelection}
                  />
                ))}
              </div>
            </section>
          )}

          {filtered.highWeight.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold">High Weight</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {filtered.highWeight.length} users
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Followed by 2-{anchorThreshold - 1} seeds
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.highWeight.map((user) => (
                  <UserNodeComponent
                    key={user.username}
                    user={user}
                    anchorCount={getAnchorCount(user.username)}
                    isSelected={selectedUsers.has(user.username)}
                    onToggleSelect={toggleUserSelection}
                  />
                ))}
              </div>
            </section>
          )}

          {filtered.longTail.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold">Long Tail</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {filtered.longTail.length} users
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Other users with weight ≥ 2
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filtered.longTail.map((user) => (
                  <UserNodeComponent
                    key={user.username}
                    user={user}
                    anchorCount={getAnchorCount(user.username)}
                    isSelected={selectedUsers.has(user.username)}
                    onToggleSelect={toggleUserSelection}
                  />
                ))}
              </div>
            </section>
          )}

        {totalVisible === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
