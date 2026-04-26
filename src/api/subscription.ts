import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types/common';
import type { SubscriptionStatus, UpgradeSubscriptionRequest } from '@/api/types/subscription';

export async function fetchSubscriptionStatus() {
  const { data } = await apiClient.get<ApiResponse<SubscriptionStatus>>(endpoints.subscription.root);
  return data;
}

export async function upgradeSubscription(payload: UpgradeSubscriptionRequest) {
  const { data } = await apiClient.post<ApiResponse<SubscriptionStatus>>(endpoints.subscription.upgrade, payload);
  return data;
}
