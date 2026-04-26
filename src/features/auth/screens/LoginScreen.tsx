import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const normalizedEmail = email.trim();
  const canSubmit = useMemo(
    () => EMAIL_PATTERN.test(normalizedEmail) && password.length >= 1,
    [normalizedEmail, password],
  );

  const handleContinue = () => {
    if (!canSubmit) {
      return;
    }

    router.replace('/onboarding/connect-bank' as never);
  };

  const handleSignUp = () => {
    router.push('/signup/email' as never);
  };

  return (
    <AuthStepLayout
      description="회원가입에 사용한 계정 정보로 로그인할 수 있어요."
      onPrimaryPress={handleContinue}
      primaryDisabled={!canSubmit}
      primaryLabel="로그인"
      secondaryAction={
        <View style={styles.signUpRow}>
          <Text style={styles.signUpPrompt}>계정이 없으신가요?</Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleSignUp}
            style={({ pressed }) => pressed && styles.signUpPressed}
          >
            <Text style={styles.signUpLink}>회원가입</Text>
          </Pressable>
        </View>
      }
      stepLabel="로그인"
      title="이메일과 비밀번호를 입력해주세요"
    >
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="이메일"
        placeholderTextColor={colors.gray400}
        style={styles.input}
        textContentType="emailAddress"
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        placeholder="비밀번호"
        placeholderTextColor={colors.gray400}
        secureTextEntry
        style={styles.input}
        textContentType="password"
        value={password}
      />
      <Text style={styles.helper}>로그인 이후에는 바로 계좌 연결 온보딩 화면으로 이어집니다.</Text>
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
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signUpPrompt: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  signUpLink: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  signUpPressed: {
    opacity: 0.72,
  },
});
