import type { Category } from '@/api/types/common';

export type TransactionListItem = {
  transaction_id: string;
  amount: number;
  merchant: string;
  category: Category;
  category_confidence: number;
  occurred_at: string;
  satisfaction_score: number | null;
  satisfaction_text: string | null;
  labeled_at: string | null;
};

export type TransactionListResponseData = {
  transactions: TransactionListItem[];
  next_cursor: string | null;
};

export type TransactionDetail = TransactionListItem & {
  merchant_mcc: string;
  linked_chatbot_session_id: string | null;
};

export type TransactionSatisfactionInput = {
  score: number;
  text?: string;
};

export type TransactionSatisfactionResponseData = {
  transaction_id: string;
  score: number;
  text: string | null;
  labeled_at: string;
};
