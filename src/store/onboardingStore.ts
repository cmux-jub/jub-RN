import { create } from 'zustand';

import type { FirstInsightResponseData, OnboardingFeedbackResponseData } from '@/api/types/onboarding';
import type { HappyPurchaseItem, TopHappyConsumption } from '@/api/types/insights';

type OnboardingStore = {
  firstInsight: FirstInsightResponseData | null;
  topHappyConsumption: TopHappyConsumption | null;
  happyPurchaseArchive: HappyPurchaseItem[];
  labeledCount: number;
  requiredCount: number;
  chatbotContextReady: boolean;
  setFeedbackResult: (result: OnboardingFeedbackResponseData) => void;
  clearFeedbackResult: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  firstInsight: null,
  topHappyConsumption: null,
  happyPurchaseArchive: [],
  labeledCount: 0,
  requiredCount: 5,
  chatbotContextReady: false,
  setFeedbackResult: (result) =>
    set({
      firstInsight: result.first_insight,
      topHappyConsumption: result.top_happy_consumption,
      happyPurchaseArchive: result.happy_purchase_archive,
      labeledCount: result.labeled_count,
      requiredCount: result.required_count,
      chatbotContextReady: result.chatbot_context_ready,
    }),
  clearFeedbackResult: () =>
    set({
      firstInsight: null,
      topHappyConsumption: null,
      happyPurchaseArchive: [],
      labeledCount: 0,
      requiredCount: 5,
      chatbotContextReady: false,
    }),
}));
