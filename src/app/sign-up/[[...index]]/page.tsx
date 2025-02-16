'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <SignUp path="/sign-up" routing="path" />
    </main>
  );
}
