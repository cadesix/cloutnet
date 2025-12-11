import { ApifyClient } from 'apify-client';
import type {
  ApifyFollowingResult,
  ApifyProfileResult,
  ActorRunStatus,
} from './types';

const FOLLOWING_ACTOR_ID = 'louisdeconinck/instagram-following-scraper';
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

    // Get Instagram cookies from environment variable
    const cookies = process.env.INSTAGRAM_COOKIES;
    if (!cookies) {
      throw new Error('INSTAGRAM_COOKIES environment variable is not set. Please add your Instagram session cookies.');
    }

    console.log(`[scrapeFollowing] Scraping following lists for ${usernames.length} users`);

    const run = await this.client.actor(FOLLOWING_ACTOR_ID).call({
      cookies: cookies,
      usernames: usernames,
    });

    const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
    
    console.log(`[scrapeFollowing] Received ${items.length} total following records`);
    if (items.length > 0) {
      console.log('[scrapeFollowing] Sample item:', JSON.stringify(items[0], null, 2));
    }

    const edges: ApifyFollowingResult[] = [];

    // Parse the response format: { username: "...", followed_by: "...", ... }
    for (const item of items) {
      const followedUsername = (item as any).username;
      const seedUsername = (item as any).followed_by;
      
      if (followedUsername && seedUsername) {
        edges.push({
          ownerUsername: String(seedUsername),
          username: String(followedUsername),
        });
      }
    }

    console.log(`[scrapeFollowing] Total edges extracted: ${edges.length}`);
    return edges;
  }

  async scrapeProfiles(usernames: string[]): Promise<ApifyProfileResult[]> {
    if (!usernames || usernames.length === 0) {
      throw new Error('Usernames array cannot be empty');
    }

    const run = await this.client.actor(PROFILE_ACTOR_ID).call({
      usernames: usernames,
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
      usernames: usernames,
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
