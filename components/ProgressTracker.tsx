import type { AnalysisPhase } from '@/lib/types';

interface ProgressTrackerProps {
  phase: AnalysisPhase;
  message?: string;
  current?: number;
  total?: number;
}

const phaseLabels: Record<AnalysisPhase, string> = {
  input: 'Awaiting input',
  estimation: 'Estimating network size',
  confirmation: 'Awaiting confirmation',
  'scraping-following': 'Scraping following lists',
  transforming: 'Computing connection weights',
  'scraping-profiles': 'Enriching with metadata',
  'computing-anchors': 'Computing anchor nodes',
  complete: 'Analysis complete',
  error: 'Error occurred',
};

export default function ProgressTracker({
  phase,
  message,
  current,
  total,
}: ProgressTrackerProps) {
  const isActive = ![
    'input',
    'estimation',
    'confirmation',
    'complete',
    'error',
  ].includes(phase);

  if (!isActive) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          <h3 className="text-lg font-semibold">{phaseLabels[phase]}</h3>
        </div>

        {message && (
          <p className="text-gray-600 mb-3">{message}</p>
        )}

        {current !== undefined && total !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>
                {current} / {total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(current / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          This may take a few minutes. Please keep this page open.
        </div>
      </div>
    </div>
  );
}
