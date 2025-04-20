'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

function AuthButtonContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSignIn = async () => {
    const callbackUrl = searchParams.get('callbackUrl') || pathname;
    await signIn("google", {
      callbackUrl,
      redirect: true,
    });
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true
    });
  };

  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user?.name || "Profile picture"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="text-sm font-medium"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={handleSignIn}
      className="bg-emerald-500 hover:bg-emerald-600"
    >
      Sign In
    </Button>
  );
}

export function AuthButton() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthButtonContent />
    </Suspense>
  );
}
