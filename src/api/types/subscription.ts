import type { SubscriptionTier } from '@/api/types/common';

export type SubscriptionStatus = {
  tier: SubscriptionTier;
  chatbot_usage_count: number;
  chatbot_full_remaining: number;
  downgrades_at: string | null;
  next_billing_date: string | null;
};

export type UpgradeSubscriptionRequest = {
  plan: 'MONTHLY';
  payment_method_token: string;
};
