interface ConfirmationGateProps {
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export default function ConfirmationGate({
  onConfirm,
  onCancel,
  isProcessing,
}: ConfirmationGateProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-yellow-900">
          Ready to proceed?
        </h3>

        <p className="text-gray-700 mb-4">
          This will use Apify credits to scrape the estimated number of accounts shown above.
          The process may take several minutes depending on the size of the networks.
        </p>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-medium mb-2">What happens next:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>Scrape following lists for all seed accounts</li>
            <li>Filter users by connection weight (≥2 seeds)</li>
            <li>Scrape metadata only for filtered users (80-95% reduction)</li>
            <li>Compute anchors and display results</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Starting...' : 'Confirm & Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
