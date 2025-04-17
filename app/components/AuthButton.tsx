'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user?.name || "Profile picture"}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <p className="text-lg">Welcome, {session.user?.name}!</p>
        </div>
        <button
          onClick={() => signOut()}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      Sign in with Google
    </button>
  );
}
