import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type {
  FirstInsightResponseData,
  OnboardingFeedbackResponseData,
  OnboardingProgressResponseData,
  OnboardingQuestionsResponseData,
  SubmitOnboardingFeedbackRequest,
  TransactionsToLabelResponseData,
} from '@/api/types/onboarding';

export async function fetchOnboardingQuestions(limit?: number) {
  const { data } = await apiClient.get<ApiResponse<OnboardingQuestionsResponseData>>(endpoints.onboarding.questions, {
    params: typeof limit === 'number' ? { limit } : undefined,
  });
  return data;
}

export async function submitOnboardingFeedback(payload: SubmitOnboardingFeedbackRequest) {
  const { data } = await apiClient.post<ApiResponse<OnboardingFeedbackResponseData>>(
    endpoints.onboarding.feedback,
    payload,
  );
  return data;
}

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
