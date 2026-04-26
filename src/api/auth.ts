import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type { AuthSessionData, LoginRequest, RefreshRequest, SignUpRequest, UserMe } from '@/api/types/auth';

export async function signUp(payload: SignUpRequest) {
  const { data } = await apiClient.post<ApiResponse<AuthSessionData>>(endpoints.auth.signUp, payload);
  return data;
}

export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<ApiResponse<AuthSessionData>>(endpoints.auth.login, payload);
  return data;
}

export async function refreshSession(payload: RefreshRequest) {
  const { data } = await apiClient.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
    endpoints.auth.refresh,
    payload,
  );
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<ApiResponse<UserMe>>(endpoints.auth.me);
  return data;
}
