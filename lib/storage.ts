import type { SavedAnalysis, UserNode, Edge } from './types';

const STORAGE_KEY = 'cloutnet_analyses';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function saveAnalysis(
  seeds: string[],
  edges: Edge[],
  results: UserNode[],
  anchorThreshold: number
): void {
  if (typeof window === 'undefined') return;

  const analysis: SavedAnalysis = {
    id: generateId(),
    timestamp: Date.now(),
    seeds,
    edges,
    results,
    anchorThreshold,
  };

  const existing = loadAnalyses();
  const updated = [analysis, ...existing];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function exportAnalysis(
  seeds: string[],
  edges: Edge[],
  results: UserNode[],
  anchorThreshold: number
): void {
  const analysis: SavedAnalysis = {
    id: generateId(),
    timestamp: Date.now(),
    seeds,
    edges,
    results,
    anchorThreshold,
  };

  const dataStr = JSON.stringify(analysis, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `cloutnet-analysis-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function loadAnalyses(): SavedAnalysis[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const analyses: SavedAnalysis[] = JSON.parse(stored);
    const now = Date.now();

    const valid = analyses.filter((a) => now - a.timestamp < MAX_AGE_MS);

    if (valid.length !== analyses.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }

    return valid;
  } catch (error) {
    console.error('Failed to load analyses:', error);
    return [];
  }
}

export function deleteAnalysis(id: string): void {
  if (typeof window === 'undefined') return;

  const existing = loadAnalyses();
  const filtered = existing.filter((a) => a.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getAnalysis(id: string): SavedAnalysis | undefined {
  const analyses = loadAnalyses();
  return analyses.find((a) => a.id === id);
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
