import { useState } from 'react';
import { KeyType } from '@/app/types';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: string, monthlyLimit: number | null) => Promise<void>;
  isCreating: boolean;
}

export default function CreateApiKeyModal({ isOpen, onClose, onSubmit, isCreating }: CreateApiKeyModalProps) {
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedKeyType, setSelectedKeyType] = useState<'production' | 'development'>('development');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);

  const keyTypes: KeyType[] = [
    {
      id: 'production',
      name: 'Production',
      description: 'Not limited to 1,000 requests/minute',
      disabled: true
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Rate limited to 100 requests/minute'
    }
  ];

  const handleSubmit = async () => {
    if (!newKeyName.trim()) return;
    await onSubmit(
      newKeyName,
      selectedKeyType,
      isLimitEnabled ? parseInt(monthlyLimit) : null
    );
    resetForm();
  };

  const resetForm = () => {
    setNewKeyName('');
    setSelectedKeyType('development');
    setMonthlyLimit('1000');
    setIsLimitEnabled(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Create a new API key</h3>
          <p className="text-sm text-gray-500 mt-1">Enter a name and limit for the new API key.</p>
        </div>

        {/* Key Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key Name — A unique name to identify this key
          </label>
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key Name"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Key Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Key Type — Choose the environment for this key
          </label>
          <div className="space-y-3">
            {keyTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedKeyType === type.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                } ${type.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="keyType"
                  value={type.id}
                  checked={selectedKeyType === type.id}
                  onChange={() => !type.disabled && setSelectedKeyType(type.id)}
                  disabled={type.disabled}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                      selectedKeyType === type.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedKeyType === type.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {type.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
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
            disabled={isCreating || !newKeyName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
