'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <SignIn path="/sign-in" routing="path" />
    </main>
  );
}
