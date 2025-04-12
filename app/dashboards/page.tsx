'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  type?: string;
  usage?: number;
}

interface KeyType {
  id: 'production' | 'development';
  name: string;
  description: string;
  disabled?: boolean;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedKeyType, setSelectedKeyType] = useState<'production' | 'development'>('development');
  const [monthlyLimit, setMonthlyLimit] = useState<string>('1000');
  const [isLimitEnabled, setIsLimitEnabled] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      if (!response.ok) throw new Error('Failed to fetch API keys');
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName,
          type: selectedKeyType,
          monthlyLimit: isLimitEnabled ? parseInt(monthlyLimit) : null
        }),
      });

      if (!response.ok) throw new Error('Failed to create API key');

      const newKey = await response.json();
      setApiKeys([...apiKeys, newKey]);
      resetCreateForm();
    } catch (error) {
      setError('Failed to create API key');
      console.error('Error creating API key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetCreateForm = () => {
    setNewKeyName('');
    setSelectedKeyType('development');
    setMonthlyLimit('1000');
    setIsLimitEnabled(false);
    setShowCreateModal(false);
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    setError(null);
    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      setApiKeys(apiKeys.filter(key => key.id !== id));
    } catch (error) {
      setError('Failed to delete API key');
      console.error('Error deleting API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskApiKey = (key: string) => {
    const prefix = key.slice(0, 8);
    const suffix = key.slice(-4);
    return `${prefix}${'*'.repeat(24)}${suffix}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="mr-3"
            />
            <span className="text-xl font-semibold">API Keys</span>
          </div>
          <nav className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Current Plan Card */}
        <div className="mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm mb-1">CURRENT PLAN</div>
              <h2 className="text-2xl font-bold">Developer</h2>
            </div>
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm">
              Manage Plan
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm mb-1">API Usage</div>
              <div className="h-2 bg-white/20 rounded-full">
                <div className="h-2 bg-white rounded-full" style={{ width: '10%' }} />
              </div>
              <div className="text-sm mt-1">0 / 1,000 Credits</div>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">API Keys</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The key is used to authenticate your requests to the{' '}
                  <Link href="/docs/api" className="text-blue-600 hover:underline">
                    Research API
                  </Link>
                  . To learn more, see the{' '}
                  <Link href="/docs" className="text-blue-600 hover:underline">
                    documentation
                  </Link>{' '}
                  page.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full text-sm border border-gray-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add API Key
              </button>
            </div>

            <div className="mt-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm border-b border-gray-100 dark:border-gray-700">
                    <th className="pb-3 font-normal text-gray-500 dark:text-gray-400">NAME</th>
                    <th className="pb-3 font-normal text-gray-500 dark:text-gray-400">TYPE</th>
                    <th className="pb-3 font-normal text-gray-500 dark:text-gray-400">USAGE</th>
                    <th className="pb-3 font-normal text-gray-500 dark:text-gray-400">KEY</th>
                    <th className="pb-3 font-normal text-gray-500 dark:text-gray-400">OPTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-4 text-sm">{key.name}</td>
                      <td className="py-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                          dev
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500">0</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <code className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                            {visibleKeys[key.id] ? key.key : maskApiKey(key.key)}
                          </code>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title={visibleKeys[key.id] ? "Hide API key" : "Show API key"}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {visibleKeys[key.id] ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              )}
                              {!visibleKeys[key.id] && (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              )}
                            </svg>
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            title="Copy to clipboard"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteKey(key.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete key"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create API Key Modal */}
      {showCreateModal && (
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
                onClick={resetCreateForm}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={isCreating || !newKeyName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
