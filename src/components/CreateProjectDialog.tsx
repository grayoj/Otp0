'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@otp0/components/ui/dialog';
import { Button } from '@otp0/components/ui/button';
import { Input } from '@otp0/components/ui/input';
import { Label } from '@otp0/components/ui/label';
import { MoonLoader } from 'react-spinners';
import { useCreateProject } from '@otp0/hooks/useProject';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectDialog({
  open,
  onClose,
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const createProjectMutation = useCreateProject();

  const handleCreate = async () => {
    if (!projectName) return;

    await createProjectMutation.mutateAsync({ name: projectName });
    setProjectName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a New Otp0 Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              className="my-2"
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={createProjectMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createProjectMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!projectName.trim() || createProjectMutation.isPending}
            className="flex items-center gap-2"
          >
            {createProjectMutation.isPending ? (
              <>
                <MoonLoader size={16} color="white" />
                <span>Creating...</span>
              </>
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
