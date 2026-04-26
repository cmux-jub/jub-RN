import type { Category } from '@/api/types/common';
import type { HappyPurchaseItem, TopHappyConsumption } from '@/api/types/insights';

export type OnboardingSelectionReason =
  | 'LARGE_AMOUNT'
  | 'REPEATED_PURCHASE'
  | 'UNUSUAL_PATTERN'
  | 'HIGH_UNCERTAINTY';

export type OnboardingQuestionTransaction = {
  transaction_id: string;
  amount: number;
  merchant: string;
  category: Category;
  occurred_at: string;
};

export type OnboardingScoreScale = {
  min: number;
  max: number;
  min_label: string;
  max_label: string;
};

export type OnboardingQuestionPayload = {
  title: string;
  body: string;
  answer_type: 'SCORE_WITH_TEXT';
  score_scale: OnboardingScoreScale;
  required: boolean;
};

export type OnboardingQuestionItem = {
  question_id: string;
  transaction: OnboardingQuestionTransaction;
  selection_reason: OnboardingSelectionReason;
  pattern_summary: string;
  question: OnboardingQuestionPayload;
};

export type OnboardingQuestionsResponseData = {
  labeled_count: number;
  required_count: number;
  question_count: number;
  min_question_count: number;
  max_question_count: number;
  questions: OnboardingQuestionItem[];
};

export type OnboardingFeedbackAnswerInput = {
  question_id: string;
  transaction_id: string;
  score: number;
  text?: string;
};

export type SubmitOnboardingFeedbackRequest = {
  answers: OnboardingFeedbackAnswerInput[];
};

export type OnboardingFeedbackResponseData = {
  labeled_count: number;
  required_count: number;
  is_chatbot_unlocked: boolean;
  chatbot_context_ready: boolean;
  first_insight: FirstInsightResponseData | null;
  top_happy_consumption: TopHappyConsumption | null;
  happy_purchase_archive: HappyPurchaseItem[];
};

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
