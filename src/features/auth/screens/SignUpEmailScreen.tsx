import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpEmailScreen() {
  const router = useRouter();
  const { signUpDraft, updateSignUpDraft } = useAuthStore();
  const [email, setEmail] = useState(signUpDraft.email);

  const normalizedEmail = email.trim();
  const isValidEmail = useMemo(() => EMAIL_PATTERN.test(normalizedEmail), [normalizedEmail]);

  const handleNext = () => {
    if (!isValidEmail) {
      return;
    }

    updateSignUpDraft({ email: normalizedEmail });
    router.push('/signup/password' as never);
  };

  return (
    <AuthStepLayout
      description="로그인에 사용할 이메일을 입력해주세요."
      onPrimaryPress={handleNext}
      primaryDisabled={!isValidEmail}
      primaryLabel="다음"
      secondaryAction={
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.replace('/login' as never)}
          style={({ pressed }) => pressed && styles.secondaryPressed}
        >
          <Text style={styles.secondaryText}>로그인으로 돌아가기</Text>
        </Pressable>
      }
      stepLabel="회원가입 1/4"
      title="이메일을 입력해주세요"
    >
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="example@email.com"
        placeholderTextColor={colors.gray400}
        style={styles.input}
        textContentType="emailAddress"
        value={email}
      />
      <Text style={styles.helper}>
        {isValidEmail || normalizedEmail.length === 0
          ? '회원가입은 이메일, 비밀번호, 이름 입력 순서로 이어집니다.'
          : '올바른 이메일 형식으로 입력해주세요.'}
      </Text>
    </AuthStepLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    color: colors.black,
    fontSize: 16,
  },
  helper: {
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryText: {
    color: colors.gray700,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  secondaryPressed: {
    opacity: 0.72,
  },
});
