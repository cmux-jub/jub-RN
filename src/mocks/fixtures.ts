import type { ChatbotSessionSummary } from '@/api/types/chatbot';
import type { HappyPurchasesResponseData } from '@/api/types/insights';
import type { TransactionsToLabelResponseData } from '@/api/types/onboarding';
import type { CurrentWeekRetrospectiveResponseData } from '@/api/types/retrospectives';

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
      question: '최근의 구매 의향과 중고 에어팟 300,000원, 만족스러우셨나요?',
    },
  ],
};

export const mockChatbotSummary: ChatbotSessionSummary = {
  product: '중고 에어팟',
  amount: 300000,
  user_reasoning: '출퇴근길에 매일 쓸 것 같아서 계속 눈에 들어왔어요.',
  ai_data_shown: '에어팟 관련 과거 소비와 비슷한 가격대 만족도를 함께 비교했어요.',
  decision: 'BUY',
};

export const mockCurrentWeekRetrospective: CurrentWeekRetrospectiveResponseData = {
  week_start: '2026-04-20',
  week_end: '2026-04-26',
  is_completed: false,
  transactions: [
    {
      transaction_id: 't_retro_1',
      amount: 300000,
      merchant: '중고 에어팟',
      category: 'LASTING',
      occurred_at: '2026-04-22T14:00:00Z',
      selection_reason: 'CHATBOT_FOLLOW_UP',
      linked_chatbot_summary: {
        session_id: 'sess_demo_1',
        user_reasoning: '매일 이어폰을 쓸 것 같아서 필요하다고 느꼈어요.',
        decision: 'BUY',
      },
    },
  ],
};

export const mockHappyPurchases: HappyPurchasesResponseData = {
  items: [
    {
      transaction_id: 't_happy_1',
      amount: 123000,
      merchant: '명우랑 저녁 식사',
      category: 'IMMEDIATE',
      occurred_at: '2026-04-12T19:30:00Z',
      score: 5,
      text: '명우랑 같이 먹어서 좋았음.\n앞으로도 친구랑 먹을거임.',
    },
  ],
  total_count: 3,
  total_amount: 123000,
  next_cursor: null,
};
