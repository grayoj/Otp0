'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PaginatedProjectsResponse, Project } from '@otp0/constants/types';
import { useAuth } from './useAuth';
import { useState } from 'react';

export async function fetchProjects(
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedProjectsResponse> {
  const response = await axios.get(`/api/projects?page=${page}&limit=${limit}`);
  return response.data;
}

export function useProjects(limit: number = 10) {
  const { isSignedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery<
    PaginatedProjectsResponse,
    Error
  >({
    queryKey: ['projects', currentPage, limit],
    queryFn: () => fetchProjects(currentPage, limit),
    enabled: isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: data?.projects || [],
    totalPages: data?.totalPages || 1,
    currentPage,
    setCurrentPage,
    isLoading,
    isError,
  };
}

export async function fetchProjectById(projectId: string): Promise<Project> {
  const response = await axios.get(`/api/projects/${projectId}`);
  return response.data.project;
}

export function useProject(projectId: string) {
  return useQuery<Project, Error>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectById(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, { name: string }>({
    mutationFn: async ({ name }) => {
      const response = await axios.post<{ project: Project }>('/api/projects', {
        name,
      });
      return response.data.project;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.setQueryData<Project[]>(['projects'], (prev) => [
        ...(prev ?? []),
        newProject,
      ]);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await axios.delete('/api/projects', { data: { id } });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.setQueryData<Project[]>(['projects'], (prev) =>
        prev ? prev.filter((project) => project.id !== id) : [],
      );
    },
  });
}
