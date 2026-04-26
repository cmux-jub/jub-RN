import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import type { Decision } from '@/api/types/common';
import { mockChatbotSummary } from '@/mocks/fixtures';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const DECISION_COPY: Record<Decision, string> = {
  BUY: '구매할래요',
  RECONSIDER: '고민할래요',
  SKIP: '안 살래요',
};

const VALID_DECISIONS: Decision[] = ['BUY', 'RECONSIDER', 'SKIP'];

export function ChatbotSummaryScreen() {
  const router = useRouter();
  const { sessionId, decision } = useLocalSearchParams<{
    sessionId?: string;
    decision?: string;
  }>();
  const pendingDecision = useChatbotSessionStore((state) => state.pendingDecision);
  const resolvedDecision = VALID_DECISIONS.includes(decision as Decision)
    ? (decision as Decision)
    : pendingDecision ?? mockChatbotSummary.decision;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>상담 요약</Text>
        <Text style={styles.title}>{mockChatbotSummary.product ?? '상품'} 상담이 정리됐어요.</Text>
        <Text style={styles.summary}>
          세션 {sessionId ?? '[sessionId]'}에 대한 결정을 다시 확인하고 다음 회고 흐름으로 이어질 수 있게 구성했어요.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>고민한 소비</Text>
          <Text style={styles.value}>
            {mockChatbotSummary.product} · {formatWon(mockChatbotSummary.amount ?? 0)}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>왜 끌렸는지</Text>
          <Text style={styles.body}>{mockChatbotSummary.user_reasoning}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>AI가 보여준 비교 기준</Text>
          <Text style={styles.body}>{mockChatbotSummary.ai_data_shown}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>최종 결정</Text>
          <Text style={styles.decisionValue}>{DECISION_COPY[resolvedDecision]}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/insights' as never)}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>메인으로 돌아가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
    gap: 16,
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
  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 8,
  },
  label: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  value: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  body: {
    color: colors.gray800,
    fontSize: 15,
    lineHeight: 22,
  },
  decisionValue: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  button: {
    marginTop: 'auto',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
});
