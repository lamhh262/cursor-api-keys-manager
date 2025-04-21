import { useState } from 'react';
import { ApiKey } from '@/app/types';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const createApiKey = async (name: string, type: string, monthlyLimit: number | null) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          monthlyLimit
        }),
      });

      if (!response.ok) throw new Error('Failed to create API key');

      const newKey = await response.json();
      setApiKeys([newKey, ...apiKeys]);
      return { success: true, data: newKey };
    } catch (error) {
      console.error('Error creating API key:', error);
      return { success: false, error: 'Failed to create API key' };
    }
  };

  const updateApiKey = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) throw new Error('Failed to update API key');

      const updatedKey = await response.json();
      setApiKeys(apiKeys.map(key => key.id === id ? updatedKey : key));
      return { success: true, data: updatedKey };
    } catch (error) {
      console.error('Error updating API key:', error);
      return { success: false, error: 'Failed to update API key' };
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { success: false, error: 'Failed to delete API key' };
    }
  };

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}
