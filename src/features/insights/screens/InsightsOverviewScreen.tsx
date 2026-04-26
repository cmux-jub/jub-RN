import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function InsightsOverviewScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Insights"
      title="Overview surface"
      summary="Home-level insight surface that ties archive, saved amount, category satisfaction, and score trend together."
      sourceFiles={[
        'src/app/insights/index.tsx',
        'src/features/insights/screens/InsightsOverviewScreen.tsx',
        'src/api/insights.ts',
      ]}
      apiContracts={[
        'GET /insights/happy-purchases',
        'GET /insights/saved-amount',
        'GET /insights/category-satisfaction',
        'GET /insights/score-trend',
      ]}
      screenStates={[
        'full insight access',
        'limited insight access after quota',
        'sparse data',
      ]}
      notes={[
        'This is the main surface for “what I spend happily on” and “what I blocked.”',
      ]}
    />
  );
}
