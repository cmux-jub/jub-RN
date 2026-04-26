import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function SubscriptionScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Subscription"
      title="Quota and upgrade"
      summary="Show current plan state, remaining full chatbot sessions, and the limited-mode transition after the first five full sessions."
      sourceFiles={[
        'src/app/subscription/index.tsx',
        'src/features/subscription/screens/SubscriptionScreen.tsx',
        'src/api/subscription.ts',
      ]}
      apiContracts={[
        'GET /subscription',
        'POST /subscription/upgrade',
      ]}
      screenStates={[
        'FREE_FULL',
        'FREE_LIMITED',
        'PAID',
      ]}
      notes={[
        'This is an experiment surface, not a finalized billing architecture.',
      ]}
    />
  );
}
