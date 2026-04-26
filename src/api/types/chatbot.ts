import type { ApiErrorCode, Decision } from '@/api/types/common';

export type ModelTier = 'FULL' | 'LITE';

export type StartChatbotSessionRequest = {
  initial_message: string;
  amount_hint?: number;
  product_hint?: string;
};

export type StartChatbotSessionResponseData = {
  session_id: string;
  websocket_url: string;
  started_at: string;
  model_tier: ModelTier;
};

export type ChatbotDataReference =
  | {
      type: 'category_stat';
      category: string;
      avg_score: number;
    }
  | {
      type: 'transaction';
      transaction_id: string;
    };

export type ChatbotSessionSummary = {
  product: string | null;
  amount: number | null;
  user_reasoning: string;
  ai_data_shown: string;
  decision: Decision;
};

export type ChatbotMessage = {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type ChatbotSessionListItem = {
  session_id: string;
  started_at: string;
  ended_at: string;
  summary: {
    product: string | null;
    amount: number | null;
    decision: Decision;
  };
  linked_transaction_id: string | null;
};

export type ChatbotSessionListResponseData = {
  sessions: ChatbotSessionListItem[];
  next_cursor: string | null;
};

export type ChatbotSessionDetail = {
  session_id: string;
  started_at: string;
  ended_at: string;
  messages: ChatbotMessage[];
  summary: ChatbotSessionSummary;
  decision: Decision;
  linked_transaction_id: string | null;
};

export type DecideSessionResponseData = {
  session_id: string;
  decision: Decision;
  summary: ChatbotSessionSummary;
  linked_transaction_id: string | null;
};

export type UserMessageSocketEvent = {
  type: 'user_message';
  content: string;
};

export type DecisionSocketEvent = {
  type: 'decision';
  decision: Decision;
};

export type AssistantTokenSocketEvent = {
  type: 'assistant_token';
  content: string;
};

export type AssistantMessageDoneSocketEvent = {
  type: 'assistant_message_done';
  message_id: string;
  full_content: string;
  data_references: ChatbotDataReference[];
};

export type SessionClosedSocketEvent = {
  type: 'session_closed';
  session_id: string;
  decision: Decision;
  summary: ChatbotSessionSummary;
};

export type ChatbotSocketErrorEvent = {
  type: 'error';
  code: ApiErrorCode;
  message: string;
};

export type ChatbotServerSocketEvent =
  | AssistantTokenSocketEvent
  | AssistantMessageDoneSocketEvent
  | SessionClosedSocketEvent
  | ChatbotSocketErrorEvent;
