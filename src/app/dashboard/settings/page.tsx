'use client';

import { useAuth } from '@otp0/hooks/useAuth';
import { Button } from '@otp0/components/ui/button';
import { Card, CardContent } from '@otp0/components/ui/card';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@otp0/components/ui/avatar';
import { SignOutButton } from '@clerk/nextjs';
import { Skeleton } from '@otp0/components/ui/skeleton';
export default function SettingsPage() {
  const { user, isSignedIn, isLoading } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          ) : !isSignedIn || !user ? (
            <p className="text-red-500">You are not signed in.</p>
          ) : (
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user.imageUrl ?? ''}
                  alt={user.fullName ?? 'User'}
                />
                <AvatarFallback>
                  {user.fullName?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-lg">
                  {user.fullName ?? 'Unknown User'}
                </p>
                <p className="text-gray-500">
                  {user.emailAddresses?.[0]?.emailAddress ?? 'No Email'}
                </p>
              </div>
            </div>
          )}

          {!isLoading && isSignedIn && (
            <div className="mt-6 flex justify-end">
              <SignOutButton>
                <Button variant="destructive">Logout</Button>
              </SignOutButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
