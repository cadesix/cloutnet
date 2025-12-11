export interface Edge {
  seed: string;
  followedUser: string;
}

export interface UserNode {
  username: string;
  seedWeight: number;
  isAnchor: boolean;
  followedBySeeds: string[];
  bio?: string;
  followerCount?: number;
  profilePicUrl?: string;
  isVerified?: boolean;
}

export interface SavedAnalysis {
  id: string;
  timestamp: number;
  seeds: string[];
  edges: Edge[];
  results: UserNode[];
  anchorThreshold: number;
}

export interface ClusteredGraph {
  anchors: UserNode[];
  highWeight: UserNode[];
  longTail: UserNode[];
}

export interface SeedEstimate {
  username: string;
  followingCount: number;
  error?: string;
}

export interface ApifyFollowingResult {
  ownerUsername: string;
  username: string;
}

export interface ApifyProfileResult {
  username: string;
  followersCount: number;
  biography?: string;
  profilePicUrl?: string;
  isVerified?: boolean;
}

export interface ActorRunStatus {
  status: string;
  defaultDatasetId?: string;
}

export type AnalysisPhase =
  | 'input'
  | 'estimation'
  | 'confirmation'
  | 'scraping-following'
  | 'transforming'
  | 'scraping-profiles'
  | 'computing-anchors'
  | 'complete'
  | 'error';

export interface AnalysisState {
  phase: AnalysisPhase;
  seeds: string[];
  estimates: SeedEstimate[];
  totalEstimate: number;
  edges: Edge[];
  filteredUsers: UserNode[];
  finalResults: UserNode[];
  anchorThreshold: number;
  error?: string;
  progress?: {
    current: number;
    total: number;
    message: string;
  };
}
