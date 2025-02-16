'use client';

import { OTP } from '@otp0/constants/types';
import { fetchOtps } from '@otp0/services/client';
import { useQuery } from '@tanstack/react-query';

export function useOtps() {
  return useQuery<OTP[], Error>({
    queryKey: ['otps'],
    queryFn: () => fetchOtps(),
    staleTime: 5 * 60 * 1000,
  });
}
