import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DataGapState } from '@/components/states/DataGapState';
import { mockTransactionsToLabel } from '@/mocks/fixtures';
import { colors } from '@/theme/colors';

const FIGMA_SCREEN_HEIGHT = 852;
const HEADER_HEIGHT = 48;
const FIGMA_QUESTION_TOP = 348;
const FIGMA_BOTTOM_SHEET_HEIGHT = 237;

const COPY = {
  title: '소비 내역 회고',
  satisfied: '만족',
  dissatisfied: '불만족',
} as const;

export function LabelingQueueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const candidate = mockTransactionsToLabel.transactions[0] ?? null;

  const questionTop = Math.max(280, Math.round(height * (FIGMA_QUESTION_TOP / FIGMA_SCREEN_HEIGHT)));
  const bottomSheetHeight = Math.max(
    220,
    Math.round(height * (FIGMA_BOTTOM_SHEET_HEIGHT / FIGMA_SCREEN_HEIGHT)),
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  if (!candidate) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.emptyStateWrap}>
          <DataGapState message="지금 보여드릴 회고 대상이 없어요." />
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>{COPY.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.questionWrap, { top: questionTop }]}>
          <Text style={styles.questionText}>
            <Text style={styles.questionLead}>최근에 구매한 </Text>
            <Text style={styles.questionStrong}>{`“${candidate.merchant}”`}</Text>
            {'\n'}
            <Text style={styles.questionAmount}>{formatWon(candidate.amount)}</Text>
            <Text style={styles.questionLead}> 만족스러우신가요?</Text>
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
          <Pressable accessibilityRole="button" onPress={noop} style={styles.choiceButton}>
            <Text style={styles.choiceLabel}>{COPY.satisfied}</Text>
          </Pressable>

          <Pressable accessibilityRole="button" onPress={noop} style={styles.choiceButton}>
            <Text style={styles.choiceLabel}>{COPY.dissatisfied}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function noop() {}

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
    paddingTop: 28,
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
  emptyStateWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
