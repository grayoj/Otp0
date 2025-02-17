'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiKey, OTP, Project } from '@otp0/constants/types';

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const response = await fetch('/api/v1/keys');
  const json = await response.json();

  if (!Array.isArray(json.data)) {
    throw new Error('Invalid API response: expected an array in json.data');
  }

  return json.data.map((key: ApiKey) => ({
    id: key.id,
    name: key.name,
    liveKey: key.liveKey,
    testKey: key.testKey,
    createdAt: key.createdAt,
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await axios.get(`/api/v1/projects`);
  console.log('Raw projects API response:', response.data);

  if (!Array.isArray(response.data.projects)) {
    console.error(
      'Invalid API response: expected an array in response.data.projects',
      response.data,
    );
    throw new Error('Invalid API response');
  }

  return response.data.projects;
}

export async function fetchProjectById(projectId: string): Promise<Project> {
  const response = await axios.get(`/api/v1/projects/${projectId}`);
  return response.data.project;
}

export async function fetchOtps(): Promise<OTP[]> {
  const response = await axios.get(`/api/v1/get-otps`);
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
