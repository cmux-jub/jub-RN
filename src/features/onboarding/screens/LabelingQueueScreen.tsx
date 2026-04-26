import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function LabelingQueueScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Onboarding"
      title="Labeling queue"
      summary="Review curated past transactions and capture the first five satisfaction labels."
      sourceFiles={[
        'src/app/onboarding/labeling.tsx',
        'src/features/onboarding/screens/LabelingQueueScreen.tsx',
        'src/api/onboarding.ts',
        'src/api/transactions.ts',
      ]}
      apiContracts={[
        'GET /onboarding/transactions-to-label',
        'POST /transactions/{transaction_id}/satisfaction',
      ]}
      screenStates={[
        'queue loaded',
        'queue empty',
        'partial progress',
        'insufficient historical data',
      ]}
      notes={[
        'The harness requires a minimum of five labels before chatbot activation.',
        'Questions come from the server; RN should not invent labeling heuristics.',
      ]}
    />
  );
}
