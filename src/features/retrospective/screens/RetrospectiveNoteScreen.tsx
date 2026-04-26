import { useMemo, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { mockCurrentWeekRetrospective } from '@/mocks/fixtures';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useRetrospectiveStore } from '@/store/retrospectiveStore';
import { colors } from '@/theme/colors';

const BACK_ICON = '\u2039';

export function RetrospectiveNoteScreen() {
  const router = useRouter();
  const { score } = useLocalSearchParams<{ score?: string }>();
  const setCurrentWeek = useRetrospectiveStore((state) => state.setCurrentWeek);
  const [note, setNote] = useState('');
  const candidate = mockCurrentWeekRetrospective.transactions[0] ?? null;
  const selectedScore = useMemo(() => {
    const parsed = Number(score);

    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
      return null;
    }

    return parsed;
  }, [score]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/retrospective' as never);
  };

  const handleSubmit = () => {
    if (!candidate || selectedScore === null) {
      router.replace('/retrospective' as never);
      return;
    }

    setCurrentWeek(mockCurrentWeekRetrospective.week_start);
    track(appEvents.retrospectiveCompleted, {
      week_start: mockCurrentWeekRetrospective.week_start,
      transaction_id: candidate.transaction_id,
      score: selectedScore,
      has_note: note.trim().length > 0,
    });
    router.push('/retrospective/completed' as never);
  };

  if (!candidate || selectedScore === null) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>회고 점수를 먼저 선택해 주세요</Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/retrospective' as never)}>
            <Text style={styles.emptyLink}>별점 화면으로 돌아가기</Text>
          </Pressable>
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
          <Text style={styles.headerTitle}>소비 내역 회고</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.question}>
            최근에 구매한 <Text style={styles.questionStrong}>“{candidate.merchant}”</Text>
            {'\n'}
            <Text style={styles.questionStrong}>{formatWon(candidate.amount)}</Text>, 특별한 경험이
            있으실까요?
          </Text>

          <TextInput
            multiline
            onChangeText={setNote}
            placeholder="회고 남기기 ..."
            placeholderTextColor={colors.gray400}
            style={styles.input}
            textAlignVertical="top"
            value={note}
          />
        </View>

        <Pressable accessibilityRole="button" onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonLabel}>기록 남기기</Text>
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
    backgroundColor: colors.gray100,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginTop: 48,
    gap: 24,
  },
  question: {
    color: colors.gray500,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
  },
  questionStrong: {
    color: colors.gray700,
    fontWeight: '700',
  },
  input: {
    minHeight: 145,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.gray800,
    fontSize: 16,
    lineHeight: 24,
  },
  submitButton: {
    marginTop: 'auto',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  submitButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  emptyLink: {
    color: colors.gray700,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
});
