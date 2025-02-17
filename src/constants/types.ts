import { JSX } from 'react';

export interface ApiKey {
  id: string;
  name: string;
  liveKey: string;
  testKey: string;
  createdAt: string;
}

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  apiKeys: ApiKey[];
};

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

export interface PaginatedProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
}

export interface KeyItem {
  id: string;
  name: string;
  liveKey: string;
  testKey: string;
  createdAt: string;
}

export interface KeysTableProps {
  keys: KeyItem[];
  visibleKeys: { [key: string]: boolean };
  toggleVisibility: (id: string) => void;
  isLoading: boolean;
}

export interface KeyItem {
  id: string;
  name: string;
  liveKey: string;
  testKey: string;
  createdAt: string;
}
