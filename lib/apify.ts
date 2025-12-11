import { ApifyClient } from 'apify-client';
import type {
  ApifyFollowingResult,
  ApifyProfileResult,
  ActorRunStatus,
} from './types';

const FOLLOWING_ACTOR_ID = 'apify/instagram-profile-scraper';
const PROFILE_ACTOR_ID = 'apify/instagram-profile-scraper';

export class ApifyService {
  private client: ApifyClient;

  constructor(apiToken: string) {
    this.client = new ApifyClient({ token: apiToken });
  }

  async scrapeFollowing(usernames: string[]): Promise<ApifyFollowingResult[]> {
    if (!usernames || usernames.length === 0) {
      throw new Error('Usernames array cannot be empty');
    }

    const run = await this.client.actor(FOLLOWING_ACTOR_ID).call({
      startUrls: usernames.map((u) => ({ url: `https://www.instagram.com/${u}/` })),
      resultsType: 'following',
      resultsLimit: 1000,
    });

    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

    const edges: ApifyFollowingResult[] = [];
    for (const item of items) {
      if (item.following && Array.isArray(item.following)) {
        const ownerUsername = String((item as any).username || '');
        for (const followed of item.following) {
          const username = typeof followed === 'string' 
            ? followed 
            : (followed as any)?.username || String(followed);
          edges.push({
            ownerUsername,
            username,
          });
        }
      }
    }

    return edges;
  }

  async scrapeProfiles(usernames: string[]): Promise<ApifyProfileResult[]> {
    if (!usernames || usernames.length === 0) {
      throw new Error('Usernames array cannot be empty');
    }

    const run = await this.client.actor(PROFILE_ACTOR_ID).call({
      startUrls: usernames.map((u) => ({ url: `https://www.instagram.com/${u}/` })),
      resultsType: 'details',
    });

    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

    return items.map((item: any) => ({
      username: item.username,
      followersCount: item.followersCount || 0,
      biography: item.biography || '',
      profilePicUrl: item.profilePicUrl || item.profilePic || '',
      isVerified: item.verified || false,
    }));
  }

  async getProfileEstimates(usernames: string[]): Promise<{ username: string; followingCount: number }[]> {
    if (!usernames || usernames.length === 0) {
      throw new Error('Usernames array cannot be empty');
    }

    const run = await this.client.actor(PROFILE_ACTOR_ID).call({
      startUrls: usernames.map((u) => ({ url: `https://www.instagram.com/${u}/` })),
      resultsType: 'details',
    });

    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

    return items.map((item: any) => ({
      username: item.username,
      followingCount: item.followingCount || item.followsCount || 0,
    }));
  }

  async pollActorRun(runId: string): Promise<ActorRunStatus> {
    const run = await this.client.run(runId).get();
    return {
      status: run?.status || 'UNKNOWN',
      defaultDatasetId: run?.defaultDatasetId,
    };
  }

  async waitForRun(runId: string, maxWaitMs: number = 300000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.pollActorRun(runId);

      if (status.status === 'SUCCEEDED') {
        return;
      }

      if (status.status === 'FAILED' || status.status === 'ABORTED') {
        throw new Error(`Actor run ${status.status.toLowerCase()}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error('Actor run timeout');
  }
}

export function createApifyService(): ApifyService {
  const apiToken = process.env.APIFY_API_TOKEN;

  if (!apiToken) {
    throw new Error('APIFY_API_TOKEN environment variable is not set');
  }

  return new ApifyService(apiToken);
}
