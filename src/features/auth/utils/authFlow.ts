import { isAxiosError } from 'axios';

import type { OnboardingStatus } from '@/api/types/common';

// API requires birth_year, but the current sign-up design does not collect it yet.
export const DEFAULT_SIGN_UP_BIRTH_YEAR = 1998;

export function resolvePostAuthRoute(onboardingStatus: OnboardingStatus) {
  switch (onboardingStatus) {
    case 'NEEDS_BANK_LINK':
      return '/insights';
    case 'NEEDS_LABELING':
      return '/onboarding/labeling';
    case 'READY':
      return '/insights';
    default:
      return '/login';
  }
}

export function getAuthErrorMessage(
  error: unknown,
  fallback = '\uC694\uCCAD\uC744 \uCC98\uB9AC\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.',
) {
  if (isAxiosError(error)) {
    const responseMessage = error.response?.data?.error?.message;

    if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
      return responseMessage;
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
