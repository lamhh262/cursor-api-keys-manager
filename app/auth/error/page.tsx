'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // Log error for debugging
    if (error) {
      console.error('Auth error:', error);
    }
  }, [error]);

  return (
    <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tighter">Authentication Error</h1>
        <p className="text-muted-foreground">
          {error === 'Configuration'
            ? 'There is a problem with the server configuration.'
            : error === 'AccessDenied'
            ? 'You do not have permission to sign in.'
            : 'An error occurred during authentication. Please try again.'}
        </p>
      </div>

      <div className="space-y-4">
        <Link href="/auth/signin">
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
            Try Again
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Suspense fallback={
        <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">Loading...</h1>
          </div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
