import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function SavedAmountScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Insights"
      title="Blocked spending counter"
      summary="Track how much money was blocked through SKIP decisions and frame it as spending avoided, not guilt savings."
      sourceFiles={[
        'src/app/insights/saved.tsx',
        'src/features/insights/screens/SavedAmountScreen.tsx',
        'src/components/banners/UsageLimitBanner.tsx',
      ]}
      apiContracts={[
        'GET /insights/saved-amount',
      ]}
      screenStates={[
        'all-time total',
        'monthly or yearly filter',
        'no skipped sessions yet',
      ]}
      notes={[
        'Copy should emphasize “blocked spending” rather than shaming consumption.',
      ]}
    />
  );
}
