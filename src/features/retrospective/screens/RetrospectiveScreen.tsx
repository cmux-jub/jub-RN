import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function RetrospectiveScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Retrospective"
      title="Current-week review"
      summary="Sunday review flow for rating selected transactions, optionally adding a note, and comparing predicted vs actual satisfaction."
      sourceFiles={[
        'src/app/retrospective/index.tsx',
        'src/features/retrospective/screens/RetrospectiveScreen.tsx',
        'src/store/retrospectiveStore.ts',
      ]}
      apiContracts={[
        'GET /retrospectives/current-week',
        'POST /retrospectives',
      ]}
      screenStates={[
        'eligible Sunday queue',
        'already completed this week',
        'no curated items',
        'batched submission error',
      ]}
      notes={[
        'Each entry requires a 1-5 score.',
        'Chatbot BUY follow-ups should surface prominently here.',
      ]}
    />
  );
}
