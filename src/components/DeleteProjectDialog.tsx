'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@otp0/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@otp0/components/ui/dialog';

interface Props {
  projectId: string;
  projectName: string;
  onDelete: (id: string) => void;
}

export function DeleteProjectDialog({
  projectId,
  projectName,
  onDelete,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete "{projectName}"?</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(projectId);
              setIsOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
