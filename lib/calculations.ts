import type { Edge, UserNode } from './types';

export function computeSeedWeights(edges: Edge[]): Map<string, { weight: number; seeds: string[] }> {
  const weightMap = new Map<string, { weight: number; seeds: string[] }>();

  for (const edge of edges) {
    const existing = weightMap.get(edge.followedUser) || { weight: 0, seeds: [] };

    if (!existing.seeds.includes(edge.seed)) {
      existing.weight += 1;
      existing.seeds.push(edge.seed);
    }

    weightMap.set(edge.followedUser, existing);
  }

  return weightMap;
}

export function filterBySeedWeight(
  weightMap: Map<string, { weight: number; seeds: string[] }>,
  minWeight: number
): UserNode[] {
  const users: UserNode[] = [];

  for (const [username, data] of weightMap.entries()) {
    if (data.weight >= minWeight) {
      users.push({
        username,
        seedWeight: data.weight,
        followedBySeeds: data.seeds,
        isAnchor: false,
      });
    }
  }

  return users.sort((a, b) => b.seedWeight - a.seedWeight);
}

export function calculateAnchorThreshold(seedCount: number): number {
  return Math.max(3, Math.ceil(seedCount * 0.4));
}

export function countAnchorsFollowing(
  username: string,
  edges: Edge[],
  anchors: Set<string>
): number {
  let count = 0;

  for (const edge of edges) {
    if (edge.followedUser === username && anchors.has(edge.seed)) {
      count++;
    }
  }

  return count;
}
