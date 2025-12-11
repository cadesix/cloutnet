'use client';

import { useState } from 'react';
import type { UserNode as UserNodeType } from '@/lib/types';
import UserTooltip from './UserTooltip';

interface UserNodeProps {
  user: UserNodeType;
  anchorCount: number;
  isSelected?: boolean;
  onToggleSelect?: (username: string) => void;
}

export default function UserNode({ user, anchorCount, isSelected, onToggleSelect }: UserNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShowTooltip(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = () => {
    // Toggle selection
    if (onToggleSelect) {
      onToggleSelect(user.username);
    }
    
    // Open Instagram profile in new tab
    window.open(`https://www.instagram.com/${user.username}/`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div
          className={`
            flex flex-col items-center p-3 rounded-lg transition-all
            ${isSelected ? 'ring-4 ring-green-400 ring-offset-2' : ''}
            ${user.isAnchor ? 'bg-purple-100 border-2 border-purple-400' : 'bg-gray-100 border border-gray-300'}
            hover:shadow-lg hover:scale-105
          `}
        >
          {user.profilePicUrl ? (
            <img
              src={user.profilePicUrl}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-white shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-gray-600 font-bold text-xl">
              {user.username[0].toUpperCase()}
            </div>
          )}

          <div className="text-center">
            <div className="font-medium text-sm truncate max-w-[100px]">
              @{user.username}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span
                className={`
                  inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                  ${user.isAnchor ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}
                `}
              >
                {user.seedWeight}
              </span>
              {user.isVerified && (
                <span className="text-blue-500 text-sm">✓</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTooltip && (
        <UserTooltip user={user} anchorCount={anchorCount} position={mousePos} />
      )}
    </>
  );
}
