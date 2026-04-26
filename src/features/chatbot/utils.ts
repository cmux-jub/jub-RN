import type { ChatbotSessionSummary } from '@/api/types/chatbot';
import type { Decision } from '@/api/types/common';

export const DECISION_LABELS: Record<Decision, string> = {
  BUY: '구매할래요',
  RECONSIDER: '고민할래요',
  SKIP: '안 살래요',
};

export function formatWon(amount: number | null | undefined) {
  if (typeof amount !== 'number') {
    return '금액 미확인';
  }

  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatSessionDateTime(isoDate: string | null | undefined) {
  if (!isoDate) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export function getSessionProductLabel(summary: Pick<ChatbotSessionSummary, 'product'> | null | undefined) {
  return summary?.product?.trim() || '상담한 소비';
}
