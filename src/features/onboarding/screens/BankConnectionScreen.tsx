import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function BankConnectionScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Onboarding"
      title="Bank connection"
      summary="Dedicated surface for OAuth start, callback completion, and account link confirmation."
      sourceFiles={[
        'src/app/onboarding/connect-bank.tsx',
        'src/features/onboarding/screens/BankConnectionScreen.tsx',
        'src/api/banking.ts',
      ]}
      apiContracts={[
        'POST /banking/oauth/start',
        'POST /banking/oauth/callback',
      ]}
      screenStates={[
        'redirect pending',
        'callback success',
        'callback failure',
        'linked account summary',
      ]}
      notes={[
        'Bank integration is external-system dependent, so RN focuses on flow control and feedback.',
        'This is scaffold-only; real deep-link callback wiring comes later.',
      ]}
    />
  );
}
