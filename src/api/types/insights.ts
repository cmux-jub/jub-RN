import type { Category } from '@/api/types/common';

export type MonthlySpendingComparison = {
  current_month_amount: number;
  previous_month_amount: number;
  difference_amount: number;
  difference_percent: number | null;
  difference_display: string;
  difference_percent_display: string;
};

export type AmountComparison = {
  current_amount: number;
  previous_amount: number;
  difference_amount: number;
  difference_percent: number | null;
  difference_display: string;
  difference_percent_display: string;
};

export type TopHappyConsumption = {
  message: string;
  category: Category | null;
  category_name: string | null;
  avg_score: number | null;
  total_amount: number;
  count: number;
};

export type MainInsightsResponseData = {
  monthly_spending: MonthlySpendingComparison;
  saved_amount_comparison: AmountComparison;
  top_happy_consumption: TopHappyConsumption;
  saved_amount: number;
  saved_count: number;
};

export type HappyPurchaseItem = {
  transaction_id: string;
  amount: number;
  related_total_amount: number;
  merchant: string;
  category: Category;
  occurred_at: string;
  score: number;
  text: string | null;
};

export type HappyPurchasesResponseData = {
  items: HappyPurchaseItem[];
  total_count: number;
  total_amount: number;
  next_cursor: string | null;
};

export type SavedAmountPeriod = 'all' | 'month' | 'year';

export type SavedAmountRecentSkip = {
  session_id: string;
  product: string;
  amount: number;
  decided_at: string;
};

export type SavedAmountResponseData = {
  total_saved: number;
  skip_count: number;
  reconsider_count: number;
  recent_skips: SavedAmountRecentSkip[];
};

export type CategorySatisfactionItem = {
  name: string;
  avg_score: number;
  count: number;
  total_amount: number;
};

export type CategorySatisfactionResponseData = {
  categories: CategorySatisfactionItem[];
};

export type ScoreTrendPeriod = '8w' | '12w' | '6m';

export type ScoreTrendPoint = {
  week_start: string;
  avg_score: number;
};

export type ScoreTrendResponseData = {
  data_points: ScoreTrendPoint[];
};
