import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export function SignUpPasswordScreen() {
  const router = useRouter();
  const { signUpDraft, updateSignUpDraft } = useAuthStore();
  const [password, setPassword] = useState(signUpDraft.password);

  const handleNext = () => {
    if (password.length < 8) {
      return;
    }

    updateSignUpDraft({ password });
    router.push('/signup/name' as never);
  };

  return (
    <AuthStepLayout
      description="8자 이상의 비밀번호를 입력해주세요."
      onPrimaryPress={handleNext}
      primaryDisabled={password.length < 8}
      primaryLabel="다음"
      secondaryAction={
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={({ pressed }) => pressed && styles.secondaryPressed}
        >
          <Text style={styles.secondaryText}>이전 단계</Text>
        </Pressable>
      }
      stepLabel="회원가입 2/4"
      title="비밀번호를 입력해주세요"
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        placeholder="비밀번호"
        placeholderTextColor={colors.gray400}
        secureTextEntry
        style={styles.input}
        textContentType="newPassword"
        value={password}
      />
      <Text style={styles.helper}>8자 이상 입력하면 다음 단계로 이동할 수 있어요.</Text>
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
