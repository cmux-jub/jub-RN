import { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { mockCurrentWeekRetrospective } from '@/mocks/fixtures';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const BACK_ICON = '\u2039';
const SCORE_OPTIONS = [1, 2, 3, 4, 5] as const;

export function RetrospectiveScreen() {
  const router = useRouter();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const candidate = mockCurrentWeekRetrospective.transactions[0] ?? null;

  useEffect(() => {
    track(appEvents.retrospectiveViewed, {
      week_start: mockCurrentWeekRetrospective.week_start,
      transaction_id: candidate?.transaction_id ?? null,
    });
  }, [candidate?.transaction_id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  const handleNext = () => {
    if (!candidate || selectedScore === null) {
      return;
    }

    router.push({
      pathname: '/retrospective/note',
      params: { score: String(selectedScore) },
    } as never);
  };

  if (!candidate) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>이번 주에 회고할 소비가 없어요</Text>
          <Text style={styles.emptyBody}>추천할 소비가 모이면 메인 화면에서 다시 보여드릴게요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleBack}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>{BACK_ICON}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>행복 지출 회고</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>이번 주 소비 돌아보기</Text>
          <Text style={styles.question}>
            최근에 구매한 <Text style={styles.questionStrong}>“{candidate.merchant}”</Text>
            {'\n'}
            <Text style={styles.questionStrong}>{formatWon(candidate.amount)}</Text>, 실제로 얼마나
            {' '}만족스러웠나요?
          </Text>

          {candidate.linked_chatbot_summary ? (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>상담 당시 생각</Text>
              <Text style={styles.summaryBody}>
                {candidate.linked_chatbot_summary.user_reasoning}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.scorePrompt}>1점부터 5점까지 선택해 주세요.</Text>
          <View style={styles.scoreRow}>
            {SCORE_OPTIONS.map((score) => {
              const isSelected = selectedScore === score;

              return (
                <Pressable
                  key={score}
                  accessibilityRole="button"
                  onPress={() => setSelectedScore(score)}
                  style={[styles.scoreButton, isSelected && styles.scoreButtonActive]}
                >
                  <Text style={[styles.scoreValue, isSelected && styles.scoreValueActive]}>
                    {score}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={selectedScore === null}
            onPress={handleNext}
            style={[styles.nextButton, selectedScore === null && styles.nextButtonDisabled]}
          >
            <Text
              style={[
                styles.nextButtonLabel,
                selectedScore === null && styles.nextButtonLabelDisabled,
              ]}
            >
              다음
            </Text>
          </Pressable>
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
    height: 48,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 64,
    gap: 20,
  },
  eyebrow: {
    color: colors.gray500,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  question: {
    color: colors.gray700,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 35,
    textAlign: 'center',
  },
  questionStrong: {
    color: colors.gray900,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: 8,
  },
  summaryLabel: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  summaryBody: {
    color: colors.gray800,
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    gap: 20,
  },
  scorePrompt: {
    color: colors.gray600,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreButton: {
    flex: 1,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.gray100,
  },
  scoreButtonActive: {
    backgroundColor: colors.mint400,
  },
  scoreValue: {
    color: colors.gray500,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  scoreValueActive: {
    color: colors.white,
  },
  nextButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.gray900,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  nextButtonDisabled: {
    backgroundColor: colors.gray200,
  },
  nextButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  nextButtonLabelDisabled: {
    color: colors.gray400,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    color: colors.gray900,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.gray600,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
