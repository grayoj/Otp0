'use client';

import { useState } from 'react';
import { useProjects } from '@otp0/hooks/useProject';
import { ProjectsTable } from '@otp0/components/ProjectsTable';
import { ProjectsEmptyState } from '@otp0/components/ProjectsEmptyState';
import CreateProjectDialog from '@otp0/components/CreateProjectDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@otp0/components/ui/pagination';

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { projects, totalPages, currentPage, setCurrentPage, isLoading } =
    useProjects(10);

  if (isLoading || !projects || projects.length === 0) {
    return (
      <>
        <ProjectsEmptyState
          loading={isLoading}
          onCreateProject={() => setIsDialogOpen(true)}
        />
        <CreateProjectDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <ProjectsTable />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent className="flex items-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CreateProjectDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
