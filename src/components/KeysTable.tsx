'use client';

import { Button } from '@otp0/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@otp0/components/ui/table';
import { Eye, EyeOff, Clipboard } from 'lucide-react';
import { KeysEmptyState } from './KeysEmptyState';
import { useToast } from '@otp0/hooks/use-toast';

interface KeyItem {
  id: string;
  projectName: string;
  apiKey: string;
  createdAt: string;
}

interface KeysTableProps {
  keys: KeyItem[];
  visibleKeys: { [key: string]: boolean };
  toggleVisibility: (id: string) => void;
  isLoading: boolean;
}

export function KeysTable({
  keys,
  visibleKeys,
  toggleVisibility,
  isLoading,
}: KeysTableProps) {
  const { toast } = useToast();

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied to clipboard',
      description: 'API key copied successfully.',
      duration: 3000,
    });
  };

  if (isLoading || !keys.length) {
    return (
      <KeysEmptyState
        loading={isLoading}
        onCreateProject={() => console.log('Create Project Clicked')}
      />
    );
  }

  return (
    <div className="rounded-xl border p-4 m-6">
      <h2 className="text-lg font-semibold mb-4">API Keys</h2>
      <Table className="border border-gray-200 w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="p-3">Project Name</TableHead>
            <TableHead className="p-3">API Key</TableHead>
            <TableHead className="p-3">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((item) => (
            <TableRow key={item.id} className="border-b border-gray-200">
              <TableCell className="p-3 font-medium">
                {item.projectName}
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center gap-2">
                  <span>
                    {visibleKeys[item.id] ? item.apiKey : '••••••••••••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(item.id)}
                  >
                    {visibleKeys[item.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                  {visibleKeys[item.id] && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(item.apiKey)}
                    >
                      <Clipboard size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-3">
                {new Date(item.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
