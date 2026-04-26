import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

import { AuthStepLayout } from '@/features/auth/components/AuthStepLayout';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';

export function SignUpNameScreen() {
  const router = useRouter();
  const { signUpDraft, updateSignUpDraft } = useAuthStore();
  const [nickname, setNickname] = useState(signUpDraft.nickname);

  const normalizedName = nickname.trim();

  const handleNext = () => {
    if (!normalizedName) {
      return;
    }

    updateSignUpDraft({ nickname: normalizedName });
    router.push('/signup/complete' as never);
  };

  return (
    <AuthStepLayout
      description="서비스에서 사용할 이름을 입력해주세요."
      onPrimaryPress={handleNext}
      primaryDisabled={!normalizedName}
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
      stepLabel="회원가입 3/4"
      title="이름을 입력해주세요"
    >
      <TextInput
        autoCapitalize="words"
        onChangeText={setNickname}
        placeholder="이름"
        placeholderTextColor={colors.gray400}
        style={styles.input}
        textContentType="name"
        value={nickname}
      />
      <Text style={styles.helper}>입력한 이름으로 회원가입 완료 화면이 이어집니다.</Text>
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
