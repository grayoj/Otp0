'use client';

import { useState } from 'react';
import { Eye, EyeOff, Clipboard, Shuffle } from 'lucide-react';
import { Button } from '@otp0/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@otp0/components/ui/table';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { useToast } from '@otp0/hooks/use-toast';
import { useProjects, useDeleteProject } from '@otp0/hooks/useProject';
import { ProjectsEmptyState } from '@otp0/components/ProjectsEmptyState';

export function ProjectsTable() {
  const { projects, isLoading } = useProjects(10);
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [apiMode, setApiMode] = useState<
    Record<string, 'testing' | 'production'>
  >({});

  const toggleApiKeyVisibility = (key: string) => {
    setVisibleKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'Copied to clipboard',
      description: 'API key copied successfully.',
      duration: 3000,
    });
  };

  const toggleMode = (projectId: string) => {
    setApiMode((prev) => ({
      ...prev,
      [projectId]: prev[projectId] === 'testing' ? 'production' : 'testing',
    }));
  };

  if (isLoading || !projects.length) {
    return (
      <ProjectsEmptyState loading={isLoading} onCreateProject={() => {}} />
    );
  }

  return (
    <div className="rounded-xl border p-4 m-6">
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <Table className="border border-gray-200 w-full">
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="p-3">Project Name</TableHead>
            <TableHead className="p-3">Mode</TableHead>
            <TableHead className="p-3">API Key</TableHead>
            <TableHead className="p-3">Created At</TableHead>
            <TableHead className="p-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const currentMode = apiMode[project.id] || 'testing';

            const keyType = currentMode === 'testing' ? 'test' : 'live';
            const activeKey = project.apiKeys.find(
              (key) => key.type === keyType,
            );

            return (
              <TableRow key={project.id} className="border-b border-gray-200">
                <TableCell className="p-3 font-medium">
                  {project.name}
                </TableCell>

                <TableCell className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMode(project.id)}
                  >
                    {currentMode === 'testing' ? 'Testing' : 'Production'}
                    <Shuffle className="ml-2 h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="p-3">
                  <div className="flex items-center gap-2">
                    <span>
                      {visibleKeys[activeKey?.key || '']
                        ? activeKey?.key
                        : '••••••••••••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        toggleApiKeyVisibility(activeKey?.key || '')
                      }
                    >
                      {visibleKeys[activeKey?.key || ''] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                    {visibleKeys[activeKey?.key || ''] && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(activeKey?.key || '')}
                      >
                        <Clipboard size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>

                <TableCell className="p-3">
                  {new Date(project.createdAt).toLocaleString()}
                </TableCell>

                <TableCell className="p-3">
                  <DeleteProjectDialog
                    projectId={project.id}
                    projectName={project.name}
                    onDelete={() => deleteProject.mutate({ id: project.id })}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
