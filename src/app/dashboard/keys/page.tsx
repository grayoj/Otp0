'use client';

import { useState } from 'react';
import { useApiKeys, useApiKeyVisibility } from '@otp0/hooks/useApiKeys';
import { KeysTable } from '@otp0/components/KeysTable';
import { KeysEmptyState } from '@otp0/components/KeysEmptyState';
import CreateProjectDialog from '@otp0/components/CreateProjectDialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@otp0/components/ui/pagination';

export default function KeysPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { keys, totalPages, currentPage, setCurrentPage, isLoading } =
    useApiKeys();
  const { visibleKeys, toggleVisibility } = useApiKeyVisibility();

  if (isLoading) {
    return (
      <KeysEmptyState
        loading={true}
        onCreateProject={() => setIsDialogOpen(true)}
      />
    );
  }

  if (!keys.length) {
    return (
      <>
        <KeysEmptyState
          loading={false}
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
      <KeysTable
        keys={keys}
        visibleKeys={visibleKeys}
        toggleVisibility={toggleVisibility}
        isLoading={isLoading}
      />

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
