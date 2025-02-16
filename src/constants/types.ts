import { JSX } from 'react';

export interface Project {
  id: string;
  name: string;
  apiKey: string;
  createdAt: string;
}

export interface OTP {
  id: string;
  code: string;
  expiresAt: string;
  createdAt: string;
}

export interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: JSX.Element;
  description?: string;
}

export interface ApiKey {
  id: string;
  projectName: string;
  apiKey: string;
  createdAt: string;
  projectId: string;
}

export interface PaginatedProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}
