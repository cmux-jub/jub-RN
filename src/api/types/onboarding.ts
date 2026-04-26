import type { Category } from '@/api/types/common';

export type OnboardingSelectionReason =
  | 'LARGE_AMOUNT'
  | 'REPEATED_PURCHASE'
  | 'UNUSUAL_PATTERN'
  | 'HIGH_UNCERTAINTY';

export type OnboardingTransactionCandidate = {
  transaction_id: string;
  amount: number;
  merchant: string;
  category: Category;
  occurred_at: string;
  selection_reason: OnboardingSelectionReason;
  question: string;
};

export type TransactionsToLabelResponseData = {
  labeled_count: number;
  required_count: number;
  transactions: OnboardingTransactionCandidate[];
};

export type OnboardingProgressResponseData = {
  labeled_count: number;
  required_count: number;
  is_chatbot_unlocked: boolean;
  next_step: 'LABEL_MORE' | 'UNLOCKED';
};

export type FirstInsightResponseData = {
  headline: string;
  supporting_data: {
    category: string;
    avg_score: number;
    count: number;
  };
};
