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
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-1 px-8 py-4 bg-green-600 text-white font-semibold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Starting...' : 'Confirm & Start'}
        </button>
      </div>
    </div>
  );
}
