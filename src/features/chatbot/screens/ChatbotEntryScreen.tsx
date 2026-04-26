import { useMemo } from 'react';

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

const PROMPT_EXAMPLES = [
  '30만원대 무선 이어폰을 살지 고민 중이에요.',
  '이번 달 예산 안에서 운동화를 사도 괜찮을까요?',
];

export function ChatbotEntryScreen() {
  const router = useRouter();
  const { draftMessage, setDraftMessage, clearSession } = useChatbotSessionStore((state) => ({
    draftMessage: state.draftMessage,
    setDraftMessage: state.setDraftMessage,
    clearSession: state.clearSession,
  }));
  const trimmedDraft = draftMessage.trim();
  const canStart = trimmedDraft.length > 0;
  const promptExample = useMemo(
    () => (trimmedDraft.length > 0 ? null : PROMPT_EXAMPLES[0]),
    [trimmedDraft.length],
  );

  const handleStartSession = () => {
    if (!canStart) {
      return;
    }

    clearSession();
    setDraftMessage(trimmedDraft);
    router.push({
      pathname: '/chatbot/[sessionId]',
      params: {
        sessionId: 'demo-session',
        autoStart: '1',
      },
    } as never);
  };

  const handleOpenHistory = () => {
    router.push('/chatbot/history' as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AI 조언</Text>
          <Text style={styles.title}>결제 전에 한 번 더 정리해볼까요?</Text>
          <Text style={styles.summary}>
            사고 싶은 물건과 가격을 적어주시면, 지난 소비 패턴을 바탕으로 차분하게 같이
            살펴볼게요.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>무엇을 고민하고 있나요?</Text>
          <TextInput
            accessibilityLabel="채팅 시작 입력"
            autoCorrect={false}
            multiline
            onChangeText={setDraftMessage}
            placeholder={promptExample ?? '예: 에어팟 프로 35만원 살까 고민 중'}
            placeholderTextColor={colors.gray400}
            style={styles.input}
            textAlignVertical="top"
            value={draftMessage}
          />
          <Text style={styles.helperText}>
            상품명과 가격을 함께 적으면 더 정확하게 비교해드릴 수 있어요.
          </Text>
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            accessibilityRole="button"
            disabled={!canStart}
            onPress={handleStartSession}
            style={({ pressed }) => [
              styles.primaryButton,
              !canStart && styles.primaryButtonDisabled,
              pressed && canStart && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>상담 시작하기</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleOpenHistory}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>지난 상담 보기</Text>
          </Pressable>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleTitle}>이렇게 입력해보세요</Text>
          {PROMPT_EXAMPLES.map((example) => (
            <Pressable
              key={example}
              accessibilityRole="button"
              onPress={() => setDraftMessage(example)}
              style={({ pressed }) => [styles.exampleChip, pressed && styles.buttonPressed]}
            >
              <Text style={styles.exampleChipText}>{example}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 20,
    backgroundColor: colors.gray100,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: colors.gray500,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.gray900,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  summary: {
    color: colors.gray700,
    fontSize: 15,
    lineHeight: 22,
  },
  inputCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 10,
  },
  inputLabel: {
    color: colors.gray900,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  input: {
    minHeight: 160,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.gray900,
    fontSize: 16,
    lineHeight: 24,
  },
  helperText: {
    color: colors.gray500,
    fontSize: 13,
    lineHeight: 19,
  },
  actionGroup: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  secondaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  secondaryButtonLabel: {
    color: colors.gray700,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  exampleCard: {
    marginTop: 'auto',
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 10,
  },
  exampleTitle: {
    color: colors.gray700,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  exampleChip: {
    borderRadius: 12,
    backgroundColor: colors.gray50,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  exampleChipText: {
    color: colors.gray700,
    fontSize: 14,
    lineHeight: 21,
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
