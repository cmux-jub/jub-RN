import type { ChatbotSessionSummary } from '@/api/types/chatbot';
import type { TransactionsToLabelResponseData } from '@/api/types/onboarding';

export const mockTransactionsToLabel: TransactionsToLabelResponseData = {
  labeled_count: 0,
  required_count: 5,
  transactions: [
    {
      transaction_id: 't_demo_1',
      amount: 300000,
      merchant: '중고 에어팟',
      category: 'LASTING',
      occurred_at: '2026-03-12T15:00:00Z',
      selection_reason: 'LARGE_AMOUNT',
      question: '최근에 구매한 “중고 에어팟” 300,000원 만족스러우신가요?',
    },
  ],
};

export const mockChatbotSummary: ChatbotSessionSummary = {
  product: 'Headphones',
  amount: 350000,
  user_reasoning: 'Likely to use it every day.',
  ai_data_shown: 'Compared category satisfaction and similar-price history.',
  decision: 'BUY',
};
