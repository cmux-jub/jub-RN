import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type { CategorySatisfactionResponseData, HappyPurchasesResponseData, SavedAmountPeriod, SavedAmountResponseData, ScoreTrendPeriod, ScoreTrendResponseData } from '@/api/types/insights';

export async function fetchHappyPurchases() {
  const { data } = await apiClient.get<ApiResponse<HappyPurchasesResponseData>>(endpoints.insights.happyPurchases);
  return data;
}

export async function fetchSavedAmount(period: SavedAmountPeriod) {
  const { data } = await apiClient.get<ApiResponse<SavedAmountResponseData>>(endpoints.insights.savedAmount, {
    params: { period },
  });
  return data;
}

export async function fetchCategorySatisfaction(period: '30d' | '90d' | 'all') {
  const { data } = await apiClient.get<ApiResponse<CategorySatisfactionResponseData>>(endpoints.insights.categorySatisfaction, {
    params: { period },
  });
  return data;
}

export async function fetchScoreTrend(period: ScoreTrendPeriod) {
  const { data } = await apiClient.get<ApiResponse<ScoreTrendResponseData>>(endpoints.insights.scoreTrend, {
    params: { period },
  });
  return data;
}
