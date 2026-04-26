import { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchChatbotSessions } from '@/api/chatbot';
import type { ChatbotSessionListItem } from '@/api/types/chatbot';
import { DECISION_LABELS, formatSessionDateTime, formatWon, getSessionProductLabel } from '@/features/chatbot/utils';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

export function ChatbotHistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatbotSessionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchChatbotSessions();

      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setSessions(response.data.sessions);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '상담 기록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSummary = (sessionId: string) => {
    router.push({
      pathname: '/chatbot/summary/[sessionId]',
      params: { sessionId },
    } as never);
  };

  const handleOpenConversation = (sessionId: string) => {
    router.push({
      pathname: '/chatbot/[sessionId]',
      params: { sessionId },
    } as never);
  };

  const handleBackToEntry = () => {
    router.replace('/chatbot' as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>상담 기록</Text>
          <Text style={styles.title}>지난 AI 조언을 다시 확인해보세요.</Text>
          <Text style={styles.summary}>
            어떤 소비를 고민했는지, 최종적으로 어떻게 결정했는지 다시 볼 수 있어요.
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>상담 기록을 불러오는 중이에요.</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{errorMessage}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void loadSessions();
              }}
              style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.retryButtonLabel}>다시 시도</Text>
            </Pressable>
          </View>
        ) : null}

        {!isLoading && !errorMessage && sessions.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>아직 저장된 상담 기록이 없어요.</Text>
            <Text style={styles.stateBody}>첫 상담을 시작하면 여기에 대화 요약이 쌓입니다.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleBackToEntry}
              style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.retryButtonLabel}>새 상담 시작하기</Text>
            </Pressable>
          </View>
        ) : null}

        {!isLoading && !errorMessage && sessions.length > 0 ? (
          <View style={styles.list}>
            {sessions.map((session) => (
              <View key={session.session_id} style={styles.sessionCard}>
                <View style={styles.sessionMetaRow}>
                  <Text style={styles.sessionDate}>{formatSessionDateTime(session.started_at)}</Text>
                  <View style={styles.decisionChip}>
                    <Text style={styles.decisionChipLabel}>
                      {DECISION_LABELS[session.summary.decision]}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sessionTitle}>{getSessionProductLabel(session.summary)}</Text>
                <Text style={styles.sessionAmount}>{formatWon(session.summary.amount)}</Text>

                <View style={styles.sessionActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleOpenConversation(session.session_id)}
                    style={({ pressed }) => [styles.secondaryAction, pressed && styles.buttonPressed]}
                  >
                    <Text style={styles.secondaryActionLabel}>대화 보기</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => handleOpenSummary(session.session_id)}
                    style={({ pressed }) => [styles.primaryAction, pressed && styles.buttonPressed]}
                  >
                    <Text style={styles.primaryActionLabel}>요약 보기</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : null}
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
    gap: 16,
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
  stateCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 10,
  },
  stateTitle: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  stateBody: {
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 21,
  },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryButtonLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  sessionCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 14,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sessionDate: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  decisionChip: {
    borderRadius: 999,
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  decisionChipLabel: {
    color: colors.gray700,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  sessionTitle: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  sessionAmount: {
    color: colors.gray700,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.gray100,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryActionLabel: {
    color: colors.gray700,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  primaryAction: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.gray900,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryActionLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
