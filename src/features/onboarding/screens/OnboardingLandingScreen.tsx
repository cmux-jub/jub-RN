import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function OnboardingLandingScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Onboarding"
      title="Cold-start entry"
      summary="Open banking link, three-month sync, and the first route into the five-label onboarding requirement."
      sourceFiles={[
        'src/app/onboarding/index.tsx',
        'src/features/onboarding/screens/OnboardingLandingScreen.tsx',
        'src/store/authStore.ts',
      ]}
      apiContracts={[
        'POST /banking/oauth/start',
        'POST /banking/oauth/callback',
        'POST /banking/sync',
        'GET /onboarding/progress',
      ]}
      screenStates={[
        'bank link required',
        'sync in progress',
        'labeling still locked',
        'chatbot unlocked after 5 labels',
      ]}
      notes={[
        'Do not open the chatbot before the five-label threshold.',
        'This flow stays inside the two allowed input channels from the harness.',
      ]}
    />
  );
}
