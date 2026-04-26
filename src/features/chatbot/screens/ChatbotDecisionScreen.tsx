import { useEffect, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { decideChatbotSession, fetchChatbotSessionDetail } from '@/api/chatbot';
import type { ChatbotSessionDetail } from '@/api/types/chatbot';
import type { Decision } from '@/api/types/common';
import { DECISION_LABELS, formatWon, getSessionProductLabel } from '@/features/chatbot/utils';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors } from '@/theme/colors';

const FIGMA_SCREEN_HEIGHT = 852;
const HEADER_HEIGHT = 48;
const FIGMA_QUESTION_TOP = 348;
const FIGMA_BOTTOM_SHEET_HEIGHT = 285;
const DECISION_OPTIONS: Decision[] = ['BUY', 'RECONSIDER', 'SKIP'];

export function ChatbotDecisionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const { setPendingDecision, setResolvedSummary } = useChatbotSessionStore((state) => ({
    setPendingDecision: state.setPendingDecision,
    setResolvedSummary: state.setResolvedSummary,
  }));
  const [detail, setDetail] = useState<ChatbotSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState<Decision | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const questionTop = Math.max(
    280,
    Math.round(height * (FIGMA_QUESTION_TOP / FIGMA_SCREEN_HEIGHT)),
  );
  const bottomSheetHeight = Math.max(
    260,
    Math.round(height * (FIGMA_BOTTOM_SHEET_HEIGHT / FIGMA_SCREEN_HEIGHT)),
  );

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setErrorMessage('결정할 세션을 찾지 못했어요.');
      return;
    }

    void loadSessionDetail(sessionId);
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
      setErrorMessage(error instanceof Error ? error.message : '상담 내용을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/chatbot' as never);
  };

  const handleDecision = async (decision: Decision) => {
    if (!sessionId || isSubmittingDecision) {
      return;
    }

    setIsSubmittingDecision(decision);
    setErrorMessage(null);

    try {
      const response = await decideChatbotSession(sessionId, decision);

      if (!response.success) {
        setErrorMessage(response.error.message);
        return;
      }

      setPendingDecision(decision);
      setResolvedSummary(sessionId, response.data.summary);
      track(appEvents.chatbotDecisionSelected, {
        session_id: sessionId,
        decision,
      });

      router.replace({
        pathname: '/chatbot/summary/[sessionId]',
        params: { sessionId, decision },
      } as never);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '결정을 저장하지 못했어요.');
    } finally {
      setIsSubmittingDecision(null);
    }
  };

  const sessionProduct = detail?.summary?.product
    ? getSessionProductLabel(detail.summary)
    : '이 소비';
  const sessionAmount = detail?.summary?.amount ?? null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleBack}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>AI 조언</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.questionWrap, { top: questionTop }]}>
          {isLoading ? (
            <Text style={styles.questionText}>결정할 상담 내용을 불러오는 중이에요.</Text>
          ) : (
            <Text style={styles.questionText}>
              <Text style={styles.questionLead}>방금 상담한 </Text>
              <Text style={styles.questionStrong}>{`“${sessionProduct}”`}</Text>
              {'\n'}
              <Text style={styles.questionAmount}>{formatWon(sessionAmount)}</Text>
              <Text style={styles.questionLead}> 어떻게 하실래요?</Text>
            </Text>
          )}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <View
          style={[
            styles.bottomSheet,
            {
              height: bottomSheetHeight + insets.bottom,
              paddingBottom: Math.max(20, insets.bottom + 8),
            },
          ]}
        >
          {DECISION_OPTIONS.map((decision) => {
            const isPending = isSubmittingDecision === decision;

            return (
              <Pressable
                key={decision}
                accessibilityRole="button"
                disabled={isLoading || isSubmittingDecision !== null}
                onPress={() => {
                  void handleDecision(decision);
                }}
                style={({ pressed }) => [
                  styles.choiceButton,
                  isPending && styles.choiceButtonPending,
                  pressed && !isPending && styles.buttonPressed,
                ]}
              >
                <Text style={[styles.choiceLabel, isPending && styles.choiceLabelPending]}>
                  {isPending ? '저장 중...' : DECISION_LABELS[decision]}
                </Text>
              </Pressable>
            );
          })}
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
    backgroundColor: colors.gray100,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.gray500,
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 24,
    marginTop: -2,
  },
  headerTitle: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  questionWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 14,
  },
  questionText: {
    color: colors.gray500,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 35,
    textAlign: 'center',
  },
  questionLead: {
    color: colors.gray500,
    fontWeight: '500',
  },
  questionStrong: {
    color: colors.gray700,
    fontWeight: '700',
  },
  questionAmount: {
    color: colors.gray700,
    fontWeight: '600',
  },
  errorText: {
    color: colors.red300,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 29,
    gap: 20,
  },
  choiceButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: colors.gray100,
  },
  choiceButtonPending: {
    backgroundColor: colors.gray900,
  },
  choiceLabel: {
    color: colors.gray700,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
  choiceLabelPending: {
    color: colors.white,
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
