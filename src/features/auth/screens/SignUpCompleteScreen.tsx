import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { resolvePostAuthRoute } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const COPY = {
  stepLabel: '\uD68C\uC6D0\uAC00\uC785 4/4',
  continue: '\uACC4\uC18D\uD558\uAE30',
  readySuffix: '\uB2D8\uC758 \uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5C8\uC5B4\uC694',
  defaultName: '\uD68C\uC6D0',
  description:
    '\uACC4\uC815 \uC0DD\uC131\uC774 \uB05D\uB0AC\uC5B4\uC694. \uC774\uC81C \uBC14\uB85C \uC628\uBCF4\uB529\uC744 \uC774\uC5B4\uC11C \uC9C4\uD589\uD560\uAC8C\uC694.',
  bodyTop:
    '\uD68C\uC6D0\uAC00\uC785\uC774 \uC644\uB8CC\uB418\uC5B4 \uBC14\uB85C \uB2E4\uC74C \uB2E8\uACC4\uB85C \uC774\uB3D9\uD560 \uC218 \uC788\uC5B4\uC694.',
  bodyBottom:
    '\uD604\uC7AC \uC138\uC158 \uAE30\uC900 onboarding \uC0C1\uD0DC\uC5D0 \uB9DE\uB294 \uD654\uBA74\uC73C\uB85C \uC5F0\uACB0\uB429\uB2C8\uB2E4.',
} as const;

export function SignUpCompleteScreen() {
  const router = useRouter();
  const { signUpDraft, onboardingStatus, clearSignUpDraft } = useAuthStore();

  const handleContinue = () => {
    clearSignUpDraft();

    if (!onboardingStatus) {
      router.replace('/login' as never);
      return;
    }

    router.replace(resolvePostAuthRoute(onboardingStatus) as never);
  };

  return (
    <AuthStepLayout
      description={COPY.description}
      onPrimaryPress={handleContinue}
      primaryLabel={COPY.continue}
      stepLabel={COPY.stepLabel}
      title={`${signUpDraft.nickname || COPY.defaultName}${COPY.readySuffix}`}
    >
      <Text style={styles.body}>{COPY.bodyTop}</Text>
      <Text style={styles.body}>{COPY.bodyBottom}</Text>
    </AuthStepLayout>
  );
}

const styles = StyleSheet.create({
  body: {
    color: colors.gray700,
    fontSize: 15,
    lineHeight: 22,
  },
});
