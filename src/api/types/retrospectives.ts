import type { Category, Decision } from '@/api/types/common';

export type RetrospectiveSelectionReason =
  | 'HIGH_SATISFACTION_REINFORCE'
  | 'LARGE_AMOUNT_GAP'
  | 'HIGH_UNCERTAINTY'
  | 'DIVERSITY'
  | 'CHATBOT_FOLLOW_UP';

export type LinkedChatbotSummary = {
  session_id: string;
  user_reasoning: string;
  decision: Decision;
};

export type CurrentWeekRetrospectiveItem = {
  transaction_id: string;
  amount: number;
  merchant: string;
  category: Category;
  occurred_at: string;
  selection_reason: RetrospectiveSelectionReason;
  linked_chatbot_summary: LinkedChatbotSummary | null;
};

export type CurrentWeekRetrospectiveResponseData = {
  week_start: string;
  week_end: string;
  is_completed: boolean;
  transactions: CurrentWeekRetrospectiveItem[];
};

export type RetrospectiveEntryInput = {
  transaction_id: string;
  score: number;
  text: string | null;
};

export type SubmitRetrospectiveRequest = {
  week_start: string;
  entries: RetrospectiveEntryInput[];
};

export type SubmitRetrospectiveResponseData = {
  retrospective_id: string;
  week_start: string;
  completed_at: string;
  submitted_count: number;
  weekly_insight: {
    headline: string;
    highlight: string;
  };
};

export type RetrospectiveHistoryItem = {
  retrospective_id: string;
  week_start: string;
  week_end: string;
  completed_at: string;
  avg_score: number;
  entry_count: number;
};

export type RetrospectiveHistoryResponseData = {
  retrospectives: RetrospectiveHistoryItem[];
  next_cursor: string | null;
};
