'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { OTP, Project } from '@otp0/constants/types';
import { useAuth } from '@otp0/hooks/useAuth';

interface ApiKey {
  id: string;
  projectName: string;
  apiKey: string;
  createdAt: string;
  projectId: string;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const response = await axios.get(`/api/keys`);
  return response.data;
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await axios.get(`/api/projects`);
  return response.data;
}

export async function fetchProjectById(projectId: string): Promise<Project> {
  const response = await axios.get(`/api/projects/${projectId}`);
  return response.data.project;
}

export async function fetchOtps(): Promise<OTP[]> {
  const response = await axios.get(`/api/get-otps`);
  return response.data;
}

export function useProjectsCount() {
  return useQuery<number, Error>({
    queryKey: ['projectsCount'],
    queryFn: async () => {
      const projects = await fetchProjects();
      return projects.length;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useApiKeys() {
  return useQuery<ApiKey[], Error>({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys,
    staleTime: 5 * 60 * 1000,
  });
}
