'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Protected() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
            <CardDescription>
              This is a protected page that can only be accessed with a valid API key.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              You have successfully authenticated with a valid API key. This page demonstrates that your API key is working correctly.
            </p>

            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => router.push('/playground')}
              >
                Back to Playground
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
