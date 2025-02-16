'use client';

import { useState } from 'react';
import { Eye, EyeOff, Clipboard } from 'lucide-react';
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

  const toggleApiKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'Copied to clipboard',
      description: 'API key copied successfully.',
      duration: 3000,
    });
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
            <TableHead className="p-3">API Key</TableHead>
            <TableHead className="p-3">Created At</TableHead>
            <TableHead className="p-3">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="border-b border-gray-200">
              <TableCell className="p-3 font-medium">{project.name}</TableCell>
              <TableCell className="p-3">
                <div className="flex items-center gap-2">
                  <span>
                    {visibleKeys[project.id]
                      ? project.apiKey
                      : '••••••••••••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleApiKeyVisibility(project.id)}
                  >
                    {visibleKeys[project.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                  {visibleKeys[project.id] && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(project.apiKey)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
