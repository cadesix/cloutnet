'use server';

import { createApifyService } from '@/lib/apify';
import type { SeedEstimate, ApifyFollowingResult, ApifyProfileResult } from '@/lib/types';

export async function getProfileEstimates(
  usernames: string[]
): Promise<{ success: boolean; data?: SeedEstimate[]; error?: string }> {
  try {
    const apify = createApifyService();
    const estimates = await apify.getProfileEstimates(usernames);

    const result: SeedEstimate[] = estimates.map((e) => ({
      username: e.username,
      followingCount: e.followingCount,
    }));

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to get profile estimates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to estimate profiles',
    };
  }
}

export async function scrapeFollowing(
  usernames: string[]
): Promise<{ success: boolean; data?: ApifyFollowingResult[]; error?: string }> {
  try {
    const apify = createApifyService();
    const edges = await apify.scrapeFollowing(usernames);

    return { success: true, data: edges };
  } catch (error) {
    console.error('Failed to scrape following:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape following lists',
    };
  }
}

export async function scrapeProfiles(
  usernames: string[]
): Promise<{ success: boolean; data?: ApifyProfileResult[]; error?: string }> {
  try {
    const apify = createApifyService();
    const profiles = await apify.scrapeProfiles(usernames);

    return { success: true, data: profiles };
  } catch (error) {
    console.error('Failed to scrape profiles:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to scrape profile metadata',
    };
  }
}
