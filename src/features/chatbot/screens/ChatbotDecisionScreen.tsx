import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Decision } from '@/api/types/common';
import { mockChatbotSummary } from '@/mocks/fixtures';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors } from '@/theme/colors';

const FIGMA_SCREEN_HEIGHT = 852;
const HEADER_HEIGHT = 48;
const FIGMA_QUESTION_TOP = 348;
const FIGMA_BOTTOM_SHEET_HEIGHT = 285;

const DECISION_LABELS: Record<Decision, string> = {
  BUY: '구매할래요',
  RECONSIDER: '고민할래요',
  SKIP: '안 살래요',
};

const DECISION_OPTIONS: Decision[] = ['BUY', 'RECONSIDER', 'SKIP'];

export function ChatbotDecisionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const setPendingDecision = useChatbotSessionStore((state) => state.setPendingDecision);

  const questionTop = Math.max(280, Math.round(height * (FIGMA_QUESTION_TOP / FIGMA_SCREEN_HEIGHT)));
  const bottomSheetHeight = Math.max(
    260,
    Math.round(height * (FIGMA_BOTTOM_SHEET_HEIGHT / FIGMA_SCREEN_HEIGHT)),
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/chatbot' as never);
  };

  const handleDecision = (decision: Decision) => {
    setPendingDecision(decision);
    track(appEvents.chatbotDecisionSelected, {
      session_id: sessionId ?? null,
      decision,
    });

    if (!sessionId) {
      router.replace('/chatbot/history' as never);
      return;
    }

    router.push({
      pathname: '/chatbot/summary/[sessionId]',
      params: { sessionId, decision },
    } as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" hitSlop={12} onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>AI 조언</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.questionWrap, { top: questionTop }]}>
          <Text style={styles.questionText}>
            <Text style={styles.questionLead}>방금 상담한 </Text>
            <Text style={styles.questionStrong}>{`“${mockChatbotSummary.product ?? '상품'}”`}</Text>
            {'\n'}
            <Text style={styles.questionAmount}>{formatWon(mockChatbotSummary.amount ?? 0)}</Text>
            <Text style={styles.questionLead}> 구매하실건가요?</Text>
          </Text>
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
          {DECISION_OPTIONS.map((decision) => (
            <Pressable
              key={decision}
              accessibilityRole="button"
              onPress={() => handleDecision(decision)}
              style={styles.choiceButton}
            >
              <Text style={styles.choiceLabel}>{DECISION_LABELS[decision]}</Text>
            </Pressable>
          ))}
        </View>
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
  choiceLabel: {
    color: colors.gray300,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
  },
});
