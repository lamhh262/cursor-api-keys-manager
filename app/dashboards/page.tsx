'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Toast from '@/app/components/Toast';
import Sidebar from '@/app/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, EyeOff, Copy, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/app/lib/supabase';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  usage?: number;
  monthly_limit?: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  type: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [editKeyName, setEditKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData(session.user.email);
      fetchApiKeys();
    }
  }, [session]);

  const fetchUserData = async (email: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    }
  };

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

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 2000);
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
        }),
      });

      if (!response.ok) throw new Error('Failed to create API key');

      const newKey = await response.json();
      setApiKeys([newKey, ...apiKeys]);
      resetCreateForm();
      showNotification('API key created successfully');
    } catch (error) {
      setError('Failed to create API key');
      console.error('Error creating API key:', error);
      showNotification('Failed to create API key', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditKey = async () => {
    if (!editKeyName.trim() || !editingKeyId) return;

    setIsEditing(true);
    setError(null);
    try {
      const response = await fetch(`/api/keys/${editingKeyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editKeyName,
        }),
      });

      if (!response.ok) throw new Error('Failed to update API key');

      const updatedKey = await response.json();
      setApiKeys(apiKeys.map(key => key.id === editingKeyId ? updatedKey : key));
      resetEditForm();
      showNotification('API key updated successfully');
    } catch (error) {
      setError('Failed to update API key');
      console.error('Error updating API key:', error);
      showNotification('Failed to update API key', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  const resetCreateForm = () => {
    setNewKeyName('');
    setShowCreateModal(false);
  };

  const resetEditForm = () => {
    setEditKeyName('');
    setEditingKeyId(null);
    setShowEditModal(false);
  };

  const openEditModal = (key: ApiKey) => {
    setEditKeyName(key.name);
    setEditingKeyId(key.id);
    setShowEditModal(true);
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;

    setError(null);
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete API key');

      setApiKeys(apiKeys.filter(key => key.id !== id));
      showNotification('API key deleted successfully', 'warning');
    } catch (error) {
      setError('Failed to delete API key');
      console.error('Error deleting API key:', error);
      showNotification('Failed to delete API key', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied API Key to clipboard');
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

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const getRequestLimit = (type: string) => {
    return type === 'production' ? 'Unlimited' : '1,000';
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64">
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            onClose={() => {
              setShowToast(false);
              setToastMessage('');
            }}
            type={toastType}
          />
        )}

        <header className="p-8 pb-0">
          <h1 className="text-2xl font-bold mb-8">Overview</h1>

          {/* Current Plan Card */}
          <Card className="mb-8 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm mb-1 text-white/80">CURRENT PLAN</p>
                  <h2 className="text-2xl font-bold text-white">{(user?.type && user.type.charAt(0).toUpperCase() + user.type.slice(1)) || 'Development'}</h2>
                </div>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">
                  Manage Plan
                </Button>
              </div>
              <div>
                <p className="text-sm mb-2 text-white/80">API Limit</p>
                <div className="h-2 bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '2.4%' }} />
                </div>
                <p className="text-sm mt-2 text-white/80">
                  24 / {getRequestLimit(user?.type || 'development')} Requests
                </p>
              </div>
            </CardContent>
          </Card>
        </header>

        <main className="p-8">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
              + Create New Key
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">
            The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
          </p>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>USAGE</TableHead>
                <TableHead>KEY</TableHead>
                <TableHead className="text-right">OPTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>{key.name}</TableCell>
                  <TableCell>{key.usage || 0}</TableCell>
                  <TableCell>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {visibleKeys[key.id] ? key.key : maskApiKey(key.key)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="h-8 w-8"
                      >
                        {visibleKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(key.key)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(key)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteKey(key.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>

      {/* Create API Key Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new API key</DialogTitle>
            <DialogDescription>
              Enter a name for your new API key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetCreateForm}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateKey}
              disabled={isCreating || !newKeyName.trim()}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isCreating ? 'Creating...' : 'Create Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit API Key Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update the name for this API key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editKeyName">Key Name</Label>
              <Input
                id="editKeyName"
                value={editKeyName}
                onChange={(e) => setEditKeyName(e.target.value)}
                placeholder="Enter key name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetEditForm}>
              Cancel
            </Button>
            <Button
              onClick={handleEditKey}
              disabled={isEditing || !editKeyName.trim()}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isEditing ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
