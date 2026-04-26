import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type { FirstInsightResponseData, OnboardingProgressResponseData, TransactionsToLabelResponseData } from '@/api/types/onboarding';

export async function fetchTransactionsToLabel() {
  const { data } = await apiClient.get<ApiResponse<TransactionsToLabelResponseData>>(endpoints.onboarding.transactionsToLabel);
  return data;
}

export async function fetchOnboardingProgress() {
  const { data } = await apiClient.get<ApiResponse<OnboardingProgressResponseData>>(endpoints.onboarding.progress);
  return data;
}

export async function generateFirstInsight() {
  const { data } = await apiClient.post<ApiResponse<FirstInsightResponseData>>(endpoints.onboarding.firstInsight);
  return data;
}
