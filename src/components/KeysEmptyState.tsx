'use client';

import { Button } from '@otp0/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@otp0/components/ui/skeleton';

interface KeysEmptyStateProps {
  loading: boolean;
  onCreateProject: () => void;
}

export function KeysEmptyState({
  loading,
  onCreateProject,
}: KeysEmptyStateProps) {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-muted-foreground text-lg">
        You don't have any API keys. Create a project.
      </p>
      <Button onClick={onCreateProject} className="flex items-center gap-2">
        <span>Create Project</span>
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
