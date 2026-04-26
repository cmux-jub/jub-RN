import axios, { AxiosHeaders } from 'axios';

import { apiBaseUrl } from '@/api/baseUrl';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return config;
  }

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : AxiosHeaders.from(config.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
});
