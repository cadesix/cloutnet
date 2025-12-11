'use client';

import { useState } from 'react';
import type { AnalysisState, Edge, UserNode, SavedAnalysis } from '@/lib/types';
import { getProfileEstimates, scrapeFollowing, scrapeProfiles } from './actions';
import {
  computeSeedWeights,
  filterBySeedWeight,
  calculateAnchorThreshold,
} from '@/lib/calculations';
import { markAnchors } from '@/lib/graph';
import { saveAnalysis, exportAnalysis } from '@/lib/storage';
import SeedInput from '@/components/SeedInput';
import EstimationPreview from '@/components/EstimationPreview';
import ConfirmationGate from '@/components/ConfirmationGate';
import ProgressTracker from '@/components/ProgressTracker';
import NetworkGraph from '@/components/NetworkGraph';

export default function Home() {
  const [state, setState] = useState<AnalysisState>({
    phase: 'input',
    seeds: [],
    estimates: [],
    totalEstimate: 0,
    edges: [],
    filteredUsers: [],
    finalResults: [],
    anchorThreshold: 0,
  });

  const handleSeedSubmit = async (usernames: string[]) => {
    setState((prev) => ({ ...prev, phase: 'estimation', seeds: usernames }));

    const result = await getProfileEstimates(usernames);

    if (!result.success || !result.data) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        error: result.error || 'Failed to get estimates',
      }));
      return;
    }

    const totalEstimate = result.data.reduce(
      (sum, est) => sum + est.followingCount,
      0
    );

    setState((prev) => ({
      ...prev,
      phase: 'confirmation',
      estimates: result.data!,
      totalEstimate,
    }));
  };

  const handleImport = (analysis: SavedAnalysis) => {
    setState({
      phase: 'complete',
      seeds: analysis.seeds,
      estimates: [],
      totalEstimate: 0,
      edges: analysis.edges || [],
      filteredUsers: [],
      finalResults: analysis.results,
      anchorThreshold: analysis.anchorThreshold,
    });
  };

  const handleConfirm = async () => {
    setState((prev) => ({ ...prev, phase: 'scraping-following' }));

    const followingResult = await scrapeFollowing(state.seeds);

    if (!followingResult.success || !followingResult.data) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        error: followingResult.error || 'Failed to scrape following lists',
      }));
      return;
    }

    const edges: Edge[] = followingResult.data.map((item) => ({
      seed: item.ownerUsername,
      followedUser: item.username,
    }));

    setState((prev) => ({
      ...prev,
      phase: 'transforming',
      edges,
    }));

    const weightMap = computeSeedWeights(edges);
    const filteredUsers = filterBySeedWeight(weightMap, 2);

    if (filteredUsers.length === 0) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        error: 'No users found with seed weight ≥ 2',
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      phase: 'scraping-profiles',
      filteredUsers,
    }));

    const profileResult = await scrapeProfiles(
      filteredUsers.map((u) => u.username)
    );

    if (!profileResult.success || !profileResult.data) {
      setState((prev) => ({
        ...prev,
        phase: 'error',
        error: profileResult.error || 'Failed to scrape profiles',
      }));
      return;
    }

    setState((prev) => ({ ...prev, phase: 'computing-anchors' }));

    const enrichedUsers: UserNode[] = filteredUsers.map((user) => {
      const profile = profileResult.data!.find((p) => p.username === user.username);
      return {
        ...user,
        bio: profile?.biography,
        followerCount: profile?.followersCount,
        profilePicUrl: profile?.profilePicUrl,
        isVerified: profile?.isVerified,
      };
    });

    const anchorThreshold = calculateAnchorThreshold(state.seeds.length);
    const finalResults = markAnchors(enrichedUsers, anchorThreshold);

    saveAnalysis(state.seeds, edges, finalResults, anchorThreshold);

    setState((prev) => ({
      ...prev,
      phase: 'complete',
      finalResults,
      anchorThreshold,
    }));
  };

  const handleExport = () => {
    exportAnalysis(
      state.seeds,
      state.edges,
      state.finalResults,
      state.anchorThreshold
    );
  };

  const handleCancel = () => {
    setState({
      phase: 'input',
      seeds: [],
      estimates: [],
      totalEstimate: 0,
      edges: [],
      filteredUsers: [],
      finalResults: [],
      anchorThreshold: 0,
    });
  };

  const handleStartOver = () => {
    handleCancel();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {state.phase === 'input' && (
          <SeedInput onSubmit={handleSeedSubmit} onImport={handleImport} />
        )}

        {state.phase === 'estimation' && (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Estimating network size...</p>
          </div>
        )}

        {state.phase === 'confirmation' && (
          <div className="space-y-6">
            <EstimationPreview
              estimates={state.estimates}
              totalEstimate={state.totalEstimate}
            />
            <ConfirmationGate
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </div>
        )}

        <ProgressTracker phase={state.phase} />

        {state.phase === 'complete' && (
          <>
            <NetworkGraph
              users={state.finalResults}
              edges={state.edges}
              anchorThreshold={state.anchorThreshold}
              seeds={state.seeds}
            />
            <button
              onClick={handleExport}
              className="fixed bottom-6 right-6 px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              Export as JSON
            </button>
          </>
        )}

        {state.phase === 'error' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Error
              </h3>
              <p className="text-red-700 mb-4">{state.error}</p>
              <button
                onClick={handleStartOver}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
