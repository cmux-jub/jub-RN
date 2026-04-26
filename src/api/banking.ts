import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { OAuthCallbackRequest, OAuthCallbackResponseData, OAuthStartRequest, OAuthStartResponseData, SyncRequest, SyncResponseData } from '@/api/types/banking';
import type { ApiResponse } from '@/api/types/common';

export async function startBankOAuth(payload: OAuthStartRequest) {
  const { data } = await apiClient.post<ApiResponse<OAuthStartResponseData>>(endpoints.banking.oauthStart, payload);
  return data;
}

export async function completeBankOAuth(payload: OAuthCallbackRequest) {
  const { data } = await apiClient.post<ApiResponse<OAuthCallbackResponseData>>(endpoints.banking.oauthCallback, payload);
  return data;
}

export async function syncTransactions(payload: SyncRequest) {
  const { data } = await apiClient.post<ApiResponse<SyncResponseData>>(endpoints.banking.sync, payload);
  return data;
}
