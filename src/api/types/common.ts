export type ApiErrorCode =
  | 'INVALID_INPUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'BANK_LINK_REQUIRED'
  | 'LABELING_REQUIRED'
  | 'CHATBOT_QUOTA_EXCEEDED'
  | 'LLM_UNAVAILABLE'
  | 'INTERNAL_ERROR';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  error?: null;
};

export type ApiFailureResponse = {
  success: false;
  data: null;
  error: ApiError;
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiFailureResponse;

export type Category = 'IMMEDIATE' | 'LASTING' | 'ESSENTIAL';

export type Decision = 'BUY' | 'RECONSIDER' | 'SKIP';

export type OnboardingStatus = 'NEEDS_BANK_LINK' | 'NEEDS_LABELING' | 'READY';

export type SubscriptionTier = 'FREE_FULL' | 'FREE_LIMITED' | 'PAID';
