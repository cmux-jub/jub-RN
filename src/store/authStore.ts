import { create } from 'zustand';

import type { OnboardingStatus, SubscriptionTier } from '@/api/types/common';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  onboardingStatus: OnboardingStatus | null;
  subscriptionTier: SubscriptionTier | null;
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    onboardingStatus: OnboardingStatus;
    subscriptionTier?: SubscriptionTier | null;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  onboardingStatus: null,
  subscriptionTier: null,
  setSession: ({ accessToken, refreshToken, onboardingStatus, subscriptionTier = null }) =>
    set({
      accessToken,
      refreshToken,
      onboardingStatus,
      subscriptionTier,
    }),
  clearSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      onboardingStatus: null,
      subscriptionTier: null,
    }),
}));
