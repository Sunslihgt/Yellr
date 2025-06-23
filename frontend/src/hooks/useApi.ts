import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';

export const useApi = () => {
  const { token } = useAppSelector((state) => state.auth);

  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid - could dispatch logout here
      throw new Error('Unauthorized');
    }

    return response;
  }, [token]);

  return { apiCall };
};