import type { SeedEstimate } from '@/lib/types';

interface EstimationPreviewProps {
  estimates: SeedEstimate[];
  totalEstimate: number;
}

export default function EstimationPreview({
  estimates,
  totalEstimate,
}: EstimationPreviewProps) {
  const hasErrors = estimates.some((e) => e.error);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Estimation Preview</h3>

        <div className="space-y-2 mb-4">
          {estimates.map((est) => (
            <div
              key={est.username}
              className="flex justify-between items-center p-2 bg-white rounded"
            >
              <span className="font-medium">@{est.username}</span>
              {est.error ? (
                <span className="text-red-600 text-sm">{est.error}</span>
              ) : (
                <span className="text-gray-600">
                  {est.followingCount.toLocaleString()} following
                </span>
              )}
            </div>
          ))}
        </div>

        {!hasErrors && (
          <div className="pt-4 border-t border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total accounts to scrape:</span>
              <span className="text-2xl font-bold text-blue-600">
                ~{totalEstimate.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              After filtering (weight ≥ 2), this will be reduced by 80-95%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
