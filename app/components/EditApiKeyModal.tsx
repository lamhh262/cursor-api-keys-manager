import { useState, useEffect } from 'react';
import { ApiKey } from '@/app/types';

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string, monthlyLimit: number | null) => Promise<void>;
  apiKey: ApiKey | null;
  isEditing: boolean;
}

export default function EditApiKeyModal({ isOpen, onClose, onSubmit, apiKey, isEditing }: EditApiKeyModalProps) {
  const [keyName, setKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setKeyName(apiKey.name);
      if (apiKey.monthly_limit) {
        setMonthlyLimit(apiKey.monthly_limit.toString());
        setIsLimitEnabled(true);
      } else {
        setMonthlyLimit('1000');
        setIsLimitEnabled(false);
      }
    }
  }, [apiKey]);

  const handleSubmit = async () => {
    if (!apiKey || !keyName.trim()) return;
    await onSubmit(
      apiKey.id,
      keyName,
      isLimitEnabled ? parseInt(monthlyLimit) : null
    );
  };

  if (!isOpen || !apiKey) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Edit API key</h3>
          <p className="text-sm text-gray-500 mt-1">Update the name and limit for this API key.</p>
        </div>

        {/* Key Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key Name — A unique name to identify this key
          </label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder="Key Name"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Monthly Limit */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={isLimitEnabled}
              onChange={(e) => setIsLimitEnabled(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">Limit monthly usage*</span>
          </label>
          {isLimitEnabled && (
            <input
              type="number"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              className="mt-2 w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          <p className="text-xs text-gray-500 mt-2">
            *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isEditing || !keyName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
