import type { UserNode } from '@/lib/types';

interface UserTooltipProps {
  user: UserNode;
  anchorCount: number;
  position: { x: number; y: number };
}

export default function UserTooltip({ user, anchorCount, position }: UserTooltipProps) {
  return (
    <div
      className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm pointer-events-none"
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y + 10}px`,
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        {user.profilePicUrl && (
          <img
            src={user.profilePicUrl}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <a
              href={`https://instagram.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline pointer-events-auto"
            >
              @{user.username}
            </a>
            {user.isVerified && (
              <span className="text-blue-500" title="Verified">
                ✓
              </span>
            )}
          </div>
          {user.isAnchor && (
            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full mt-1">
              Anchor
            </span>
          )}
        </div>
      </div>

      {user.bio && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{user.bio}</p>
      )}

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Seed Weight:</span>
          <span className="font-medium">{user.seedWeight}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Anchors following:</span>
          <span className="font-medium">{anchorCount}</span>
        </div>
        {user.followerCount !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Followers:</span>
            <span className="font-medium">
              {user.followerCount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <div>
          <span className="font-medium">Followed by seeds:</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {user.followedBySeeds.map((seed) => (
              <span
                key={seed}
                className="px-2 py-0.5 bg-gray-100 rounded"
              >
                @{seed}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
