import { useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

export function SignUpCompleteScreen() {
  const router = useRouter();
  const { signUpDraft, clearSignUpDraft } = useAuthStore();

  const handleContinue = () => {
    clearSignUpDraft();
    router.replace('/onboarding/connect-bank' as never);
  };

  return (
    <AuthStepLayout
      description="회원가입 준비가 끝났어요. 다음 단계에서 계좌 연결을 진행할게요."
      onPrimaryPress={handleContinue}
      primaryLabel="계속하기"
      stepLabel="회원가입 4/4"
      title={`${signUpDraft.nickname || '회원'}님, 가입 준비가 끝났어요`}
    >
      <Text style={styles.body}>입력한 정보 확인이 끝나면 바로 온보딩 단계로 이동합니다.</Text>
      <Text style={styles.body}>
        지금은 데모 흐름 기준으로 계좌 연결 화면을 다음 단계로 연결해 두었습니다.
      </Text>
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
