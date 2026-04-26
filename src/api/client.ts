import axios from 'axios';

import { useAuthStore } from '@/store/authStore';

const trimmedBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');
const normalizedBaseUrl = trimmedBaseUrl
  ? `${trimmedBaseUrl}${trimmedBaseUrl.endsWith('/v1') ? '' : '/v1'}`
  : 'https://example.invalid/v1';

export const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return config;
  }

  if (typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
    return config;
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  return config;
});
