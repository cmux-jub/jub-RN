import { useEffect, useRef, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchChatbotSessionDetail } from '@/api/chatbot';
import type { ChatbotSessionDetail, ChatbotSessionSummary } from '@/api/types/chatbot';
import type { Decision } from '@/api/types/common';
import { DECISION_LABELS, formatWon, getSessionProductLabel } from '@/features/chatbot/utils';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const VALID_DECISIONS: Decision[] = ['BUY', 'RECONSIDER', 'SKIP'];

export function ChatbotSummaryScreen() {
  const router = useRouter();
  const hasTrackedRef = useRef(false);
  const { sessionId, decision } = useLocalSearchParams<{
    sessionId?: string;
    decision?: string;
  }>();
  const {
    pendingDecision,
    resolvedSummary,
    resolvedSummarySessionId,
    clearSession,
  } = useChatbotSessionStore((state) => ({
    pendingDecision: state.pendingDecision,
    resolvedSummary: state.resolvedSummary,
    resolvedSummarySessionId: state.resolvedSummarySessionId,
    clearSession: state.clearSession,
  }));
  const [detail, setDetail] = useState<ChatbotSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage('요약을 확인할 세션을 찾지 못했어요.');
      return;
    }

    void loadSessionDetail(sessionId);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || hasTrackedRef.current) {
      return;
    }

    track(appEvents.chatbotSummaryViewed, { session_id: sessionId });
    hasTrackedRef.current = true;
  }, [sessionId]);

  const loadSessionDetail = async (targetSessionId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchChatbotSessionDetail(targetSessionId);

      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setDetail(response.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '요약을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackSummary =
    sessionId && resolvedSummarySessionId === sessionId ? resolvedSummary : null;
  const summary: ChatbotSessionSummary | null = detail?.summary ?? fallbackSummary;
  const routeDecision =
    decision && VALID_DECISIONS.includes(decision as Decision)
      ? (decision as Decision)
      : null;
  const resolvedDecision =
    detail?.decision ?? routeDecision ?? pendingDecision ?? summary?.decision ?? null;

  const handleOpenConversation = () => {
    if (!sessionId) {
      return;
    }

    router.push({
      pathname: '/chatbot/[sessionId]',
      params: { sessionId },
    } as never);
  };

  const handleGoHome = () => {
    clearSession();
    router.replace('/insights' as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <Text style={styles.eyebrow}>상담 요약</Text>
        <Text style={styles.title}>
          {summary ? `${getSessionProductLabel(summary)} 상담이 정리됐어요.` : '상담 요약을 준비 중이에요.'}
        </Text>
        <Text style={styles.summary}>
          어떤 소비였는지, 왜 끌렸는지, AI가 어떤 데이터를 보여줬는지 한 번에 다시 볼 수
          있어요.
        </Text>

        {isLoading ? (
          <View style={styles.card}>
            <Text style={styles.body}>요약을 불러오는 중이에요.</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.card}>
            <Text style={styles.body}>{errorMessage}</Text>
            {sessionId ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void loadSessionDetail(sessionId);
                }}
                style={({ pressed }) => [styles.inlineButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.inlineButtonLabel}>다시 시도</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {!isLoading && !errorMessage && summary ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>고민한 소비</Text>
              <Text style={styles.value}>
                {getSessionProductLabel(summary)} · {formatWon(summary.amount)}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>왜 끌렸는지</Text>
              <Text style={styles.body}>{summary.user_reasoning}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>AI가 보여준 비교 기준</Text>
              <Text style={styles.body}>{summary.ai_data_shown}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>최종 결정</Text>
              <Text style={styles.decisionValue}>
                {resolvedDecision ? DECISION_LABELS[resolvedDecision] : '결정 미확인'}
              </Text>
            </View>
          </>
        ) : null}

        <View style={styles.footer}>
          {sessionId ? (
            <Pressable
              accessibilityRole="button"
              onPress={handleOpenConversation}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.secondaryButtonLabel}>대화 다시 보기</Text>
            </Pressable>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleGoHome}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.primaryButtonLabel}>메인으로 돌아가기</Text>
          </Pressable>
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
    paddingTop: 28,
    paddingBottom: 32,
    gap: 16,
    backgroundColor: colors.gray100,
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
  inlineButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  inlineButtonLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
    gap: 10,
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
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
