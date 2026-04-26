import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type { CurrentWeekRetrospectiveResponseData, RetrospectiveHistoryResponseData, SubmitRetrospectiveRequest, SubmitRetrospectiveResponseData } from '@/api/types/retrospectives';

export async function fetchCurrentWeekRetrospective() {
  const { data } = await apiClient.get<ApiResponse<CurrentWeekRetrospectiveResponseData>>(endpoints.retrospectives.currentWeek);
  return data;
}

export async function submitRetrospective(payload: SubmitRetrospectiveRequest) {
  const { data } = await apiClient.post<ApiResponse<SubmitRetrospectiveResponseData>>(endpoints.retrospectives.list, payload);
  return data;
}

export async function fetchRetrospectiveHistory() {
  const { data } = await apiClient.get<ApiResponse<RetrospectiveHistoryResponseData>>(endpoints.retrospectives.list);
  return data;
}
