import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function FirstInsightScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Onboarding"
      title="First insight"
      summary="Display the first insight headline once onboarding labels are complete and the chatbot is unlocked."
      sourceFiles={[
        'src/app/onboarding/first-insight.tsx',
        'src/features/onboarding/screens/FirstInsightScreen.tsx',
        'src/components/states/DataGapState.tsx',
      ]}
      apiContracts={[
        'GET /onboarding/progress',
        'POST /onboarding/first-insight',
      ]}
      screenStates={[
        'insight available',
        'still labeling',
        'no reliable supporting data',
      ]}
      notes={[
        'Tone should stay calm and data-led.',
        'Do not use guilt-based copy such as regret warnings.',
      ]}
    />
  );
}
