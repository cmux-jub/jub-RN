import { create } from 'zustand';

import type { OnboardingStatus, SubscriptionTier } from '@/api/types/common';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  onboardingStatus: OnboardingStatus | null;
  subscriptionTier: SubscriptionTier | null;
  signUpDraft: {
    email: string;
    password: string;
    nickname: string;
  };
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    onboardingStatus: OnboardingStatus;
    subscriptionTier?: SubscriptionTier | null;
  }) => void;
  updateSignUpDraft: (draft: Partial<AuthState['signUpDraft']>) => void;
  clearSignUpDraft: () => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  onboardingStatus: null,
  subscriptionTier: null,
  signUpDraft: {
    email: '',
    password: '',
    nickname: '',
  },
  setSession: ({ accessToken, refreshToken, onboardingStatus, subscriptionTier = null }) =>
    set({
      accessToken,
      refreshToken,
      onboardingStatus,
      subscriptionTier,
    }),
  updateSignUpDraft: (draft) =>
    set((state) => ({
      signUpDraft: {
        ...state.signUpDraft,
        ...draft,
      },
    })),
  clearSignUpDraft: () =>
    set({
      signUpDraft: {
        email: '',
        password: '',
        nickname: '',
      },
    }),
  clearSession: () =>
    set({
      accessToken: null,
      refreshToken: null,
      onboardingStatus: null,
      subscriptionTier: null,
      signUpDraft: {
        email: '',
        password: '',
        nickname: '',
      },
    }),
}));
