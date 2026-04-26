import type { ChatbotSessionSummary } from '@/api/types/chatbot';
import type {
  TransactionsToLabelResponseData,
} from '@/api/types/onboarding';
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
      question: '최근에 구매한 “중고 에어팟” 300,000원 만족스러우신가요?',
    },
  ],
};

export const mockChatbotSummary: ChatbotSessionSummary = {
  product: '중고 에어팟',
  amount: 300000,
  user_reasoning: '출퇴근 때마다 쓸 것 같아서 계속 눈에 들어왔어요.',
  ai_data_shown: '이어폰 관련 과거 소비와 비슷한 가격대 만족도를 함께 비교했어요.',
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
        user_reasoning: '매일 쓸 수 있을 것 같아서 필요하다고 느꼈어요.',
        decision: 'BUY',
      },
    },
  ],
};
