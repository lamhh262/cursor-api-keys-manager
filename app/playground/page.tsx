'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastType('success');
        setToastMessage('Valid API key, /protected can be accessed');
        setShowToast(true);
        setTimeout(() => {
          router.push('/protected');
        }, 1000);
      } else {
        setToastType('error');
        setToastMessage(data.error || 'Invalid API key');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setToastType('error');
      setToastMessage('Error validating API key');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>API Playground</CardTitle>
            <CardDescription>
              Test your API key to access protected resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Enter your API Key</Label>
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !apiKey.trim()}
                className="w-full"
              >
                {isSubmitting ? 'Validating...' : 'Validate API Key'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </div>
  );
}
