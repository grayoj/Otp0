'use client';

import { useState, useEffect } from 'react';
import { Button } from '@otp0/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@otp0/components/ui/table';
import { Eye, EyeOff, Clipboard, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@otp0/hooks/use-toast';
import { KeysEmptyState } from './KeysEmptyState';
import { KeysTableProps } from '@otp0/constants/types';

export function KeysTable({ keys, isLoading }: KeysTableProps) {
  const { toast } = useToast();

  const [keyMode, setKeyMode] = useState<{ [key: string]: 'live' | 'test' }>(
    {},
  );
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    if (Array.isArray(keys) && keys.length > 0) {
      setKeyMode(
        keys.reduce((acc, item) => ({ ...acc, [item.id]: 'live' }), {}),
      );
    }
  }, [keys]);

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMode = (id: string) => {
    setKeyMode((prev) => ({
      ...prev,
      [id]: prev[id] === 'live' ? 'test' : 'live',
    }));
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied to clipboard',
      description: 'API key copied successfully.',
      duration: 3000,
    });
  };

  if (isLoading || !Array.isArray(keys) || keys.length === 0) {
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
            <TableHead className="p-3">Mode</TableHead>
            <TableHead className="p-3">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((item) => {
            const currentMode = keyMode[item.id] ?? 'live';
            const currentKey =
              currentMode === 'live' ? item.liveKey : item.testKey;

            return (
              <TableRow key={item.id} className="border-b border-gray-200">
                <TableCell className="p-3 font-medium">{item.name}</TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <span>
                      {visibleKeys[item.id] ? currentKey : '••••••••••••••••••'}
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
                        onClick={() => handleCopy(currentKey)}
                      >
                        <Clipboard size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-3">
                  <Button
                    variant="outline"
                    onClick={() => toggleMode(item.id)}
                    className="flex items-center gap-2"
                  >
                    {currentMode === 'live' ? 'Live' : 'Test'}
                    <ArrowLeftRight size={16} />
                  </Button>
                </TableCell>
                <TableCell className="p-3">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
