'use client';

import { useUser } from '@clerk/nextjs';

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();

  return {
    user: user || null,
    isSignedIn: Boolean(isSignedIn),
    isLoading: !isLoaded,
  };
}
