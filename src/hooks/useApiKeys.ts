'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApiKeys } from '@otp0/services/client';
import { useState } from 'react';
import { KEYS_PER_PAGE } from '@otp0/constants/constants';
import { ApiKey } from '@otp0/constants/types';

export function useApiKeys() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: keys = [],
    isLoading,
    error,
  } = useQuery<ApiKey[], Error>({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys,
    staleTime: 5 * 60 * 1000,
  });

  const totalPages = Math.ceil(keys.length / KEYS_PER_PAGE);
  const paginatedKeys = keys.slice(
    (currentPage - 1) * KEYS_PER_PAGE,
    currentPage * KEYS_PER_PAGE,
  );

  return {
    keys: paginatedKeys,
    totalPages,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
  };
}
export function useApiKeyVisibility() {
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return { visibleKeys, toggleVisibility };
}
