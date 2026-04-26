import type { OnboardingStatus, SubscriptionTier } from '@/api/types/common';

export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  birth_year: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type AuthSessionData = {
  user_id: string;
  access_token: string;
  refresh_token: string;
  onboarding_status: OnboardingStatus;
};

export type UserMe = {
  user_id: string;
  email: string;
  nickname: string;
  onboarding_status: OnboardingStatus;
  subscription_tier: SubscriptionTier;
  chatbot_usage_count: number;
  created_at: string;
};
