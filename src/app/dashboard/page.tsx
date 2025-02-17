'use client';

import React, { useState } from 'react';
import DashboardCard from '@otp0/components/DashboardCard';
import DashboardEmptyState from '@otp0/components/DashboardEmptyState';
import CreateProjectDialog from '@otp0/components/CreateProjectDialog';
import { useOtps } from '@otp0/hooks/useOtps';
import { useProjectsCount } from '@otp0/services/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@otp0/components/ui/table';
import { Key, Folder, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: otps, isLoading: otpsLoading } = useOtps();
  const { data: projectsCount, isLoading: projectsLoading } =
    useProjectsCount();

  if (otpsLoading || projectsLoading) {
    return (
      <DashboardEmptyState
        loading={true}
        onCreateProject={() => setIsDialogOpen(true)}
      />
    );
  }

  if (!projectsCount || projectsCount === 0) {
    return (
      <>
        <DashboardEmptyState
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <DashboardCard
          title="OTPs Generated"
          value={otps?.length || 0}
          icon={<Key />}
          description="Total OTPs Generated"
        />
        <DashboardCard
          title="Active Projects"
          value={projectsCount}
          icon={<Folder />}
          description="Total Projects"
        />
        <DashboardCard
          title="OTP Success Rate"
          value={otps?.length ? '98%' : '0%'}
          icon={<CheckCircle />}
          description="Successful Generations"
        />
      </div>

      <div className="rounded-xl border p-4">
        <h2 className="text-lg font-semibold mb-4">Generated OTPs</h2>
        <Table className="border border-gray-200 w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-300">
              <TableHead className="p-3">OTP Code</TableHead>
              <TableHead className="p-3">Expires At</TableHead>
              <TableHead className="p-3">Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otps?.length ? (
              otps.map((otp, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="p-3 font-medium">{otp.code}</TableCell>
                  <TableCell className="p-3">
                    {new Date(otp.expiresAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="p-3">
                    {new Date(otp.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground p-3"
                >
                  No OTPs generated yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateProjectDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
