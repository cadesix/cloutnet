import type { UserNode, ClusteredGraph } from './types';

export function markAnchors(users: UserNode[], threshold: number): UserNode[] {
  return users.map((user) => ({
    ...user,
    isAnchor: user.seedWeight >= threshold,
  }));
}

export function clusterByWeight(users: UserNode[], anchorThreshold: number): ClusteredGraph {
  const anchors: UserNode[] = [];
  const highWeight: UserNode[] = [];
  const longTail: UserNode[] = [];

  for (const user of users) {
    if (user.isAnchor) {
      anchors.push(user);
    } else if (user.seedWeight >= 2) {
      highWeight.push(user);
    } else {
      longTail.push(user);
    }
  }

  const sortByWeight = (a: UserNode, b: UserNode) => b.seedWeight - a.seedWeight;

  return {
    anchors: anchors.sort(sortByWeight),
    highWeight: highWeight.sort(sortByWeight),
    longTail: longTail.sort(sortByWeight),
  };
}

export function applyFilters(
  users: UserNode[],
  filters: {
    usernameKeyword?: string;
    bioKeyword?: string;
    maxFollowers?: number;
  }
): UserNode[] {
  let filtered = users;

  if (filters.usernameKeyword) {
    const keyword = filters.usernameKeyword.toLowerCase();
    filtered = filtered.filter((u) => u.username.toLowerCase().includes(keyword));
  }

  if (filters.bioKeyword) {
    const keyword = filters.bioKeyword.toLowerCase();
    filtered = filtered.filter((u) => u.bio?.toLowerCase().includes(keyword));
  }

  if (filters.maxFollowers !== undefined && filters.maxFollowers > 0) {
    filtered = filtered.filter((u) => (u.followerCount || 0) <= filters.maxFollowers);
  }

  return filtered;
}
