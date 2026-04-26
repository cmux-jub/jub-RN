import type { ImageSourcePropType } from 'react-native';

import { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { mockCurrentWeekRetrospective, mockHappyPurchases } from '@/mocks/fixtures';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const BACK_ICON = '\u2039';
const happyBadgeIcon = require('../../../../assets/images/main/happy-badge.png');
const spendTrendDownIcon = require('../../../../assets/images/main/spend-trend-down.png');
const spendTrendUpIcon = require('../../../../assets/images/main/spend-trend-up.png');
const CAKE_IMAGE_URI = 'https://www.figma.com/api/mcp/asset/4934a3ff-3e59-43b0-9726-f24313f3bc47';

const CATEGORY_LABELS = {
  IMMEDIATE: '식비',
  LASTING: '지속 소비',
  ESSENTIAL: '필수 소비',
} as const;

const WEEKLY_SUMMARY = {
  weekLabel: '4월 첫째 주,',
  previousSpend: 5_000,
  previousSaved: 30_000,
} as const;

export function RetrospectiveScreen() {
  const router = useRouter();
  const signUpNickname = useAuthStore((state) => state.signUpDraft.nickname);
  const purchase = mockHappyPurchases.items[0] ?? null;
  const noteLines = purchase?.text?.split('\n').filter((line) => line.trim().length > 0) ?? [];
  const trimmedNickname = signUpNickname.trim();
  const displayName = trimmedNickname.length > 0 ? trimmedNickname : '김효현';

  useEffect(() => {
    track(appEvents.retrospectiveViewed, {
      week_start: mockCurrentWeekRetrospective.week_start,
      transaction_id: purchase?.transaction_id ?? null,
    });
  }, [purchase?.transaction_id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  if (!purchase) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>이번 주에 회고할 소비가 없어요</Text>
          <Text style={styles.emptyBody}>추천할 소비가 모이면 메인 화면에서 다시 보여드릴게요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
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
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroSection}>
            <View style={styles.badgeHalo}>
              <Image accessible={false} resizeMode="contain" source={happyBadgeIcon} style={styles.badgeIcon} />
            </View>

            <Text style={styles.weekLabel}>{WEEKLY_SUMMARY.weekLabel}</Text>
            <Text style={styles.heroText}>
              <Text style={styles.heroTextStrong}>{displayName}</Text>
              님의 행복 소비는{'\n'}
              <Text style={styles.heroTextStrong}>{`"${CATEGORY_LABELS[purchase.category]}"`}</Text>
              지출입니다.
            </Text>
          </View>

          <View style={styles.metricsCard}>
            <MetricRow
              icon={spendTrendDownIcon}
              label="저번 주 소비 내역"
              value={formatWon(WEEKLY_SUMMARY.previousSpend)}
            />

            <View style={styles.metricDivider} />

            <MetricRow
              icon={spendTrendUpIcon}
              label="저번 주 아낀 금액"
              value={formatWon(WEEKLY_SUMMARY.previousSaved)}
            />
          </View>

          <View style={styles.detailCard}>
            <Image resizeMode="contain" source={{ uri: CAKE_IMAGE_URI }} style={styles.detailImage} />

            <View style={styles.detailContent}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>지출 날짜</Text>
                <View style={styles.dateValueGroup}>
                  <Text style={styles.metaValue}>{formatArchiveDate(purchase.occurred_at)}</Text>
                  <RatingStars score={purchase.score} />
                </View>
              </View>

              <DetailRow label="지출 금액" value={formatWon(purchase.amount)} />
              <DetailRow label="카테고리" value={CATEGORY_LABELS[purchase.category]} />

              <View style={styles.reviewRow}>
                <Text style={styles.metaLabel}>회고</Text>

                <View style={styles.reviewBody}>
                  {noteLines.length > 0 ? (
                    noteLines.map((line) => (
                      <Text key={line} style={styles.reviewText}>
                        {line}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.reviewTextMuted}>작성된 회고가 없어요.</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

type MetricRowProps = {
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

function MetricRow({ icon, label, value }: MetricRowProps) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricCopy}>
        <Image accessible={false} resizeMode="contain" source={icon} style={styles.metricIcon} />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

type RatingStarsProps = {
  score: number;
};

function RatingStars({ score }: RatingStarsProps) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }, (_, index) => (
        <Text
          key={`rating-star-${index + 1}`}
          style={[styles.star, index < score ? styles.starFilled : styles.starMuted]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function formatArchiveDate(date: string) {
  const [year = '', month = '', day = ''] = date.split('T')[0]?.split('-') ?? [];
  return `${year}.${month}.${day}`;
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
    justifyContent: 'center',
    paddingHorizontal: 20,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 18,
  },
  badgeHalo: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    backgroundColor: colors.yellow300,
  },
  badgeIcon: {
    width: 56,
    height: 56,
  },
  weekLabel: {
    marginTop: 22,
    color: colors.gray900,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  heroText: {
    marginTop: 12,
    color: colors.gray900,
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 39,
    textAlign: 'center',
  },
  heroTextStrong: {
    fontWeight: '700',
  },
  metricsCard: {
    marginTop: 28,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 17,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  metricIcon: {
    width: 32,
    height: 32,
  },
  metricLabel: {
    color: colors.gray600,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flexShrink: 1,
  },
  metricValue: {
    color: colors.gray900,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  metricDivider: {
    marginVertical: 14,
    height: 1,
    backgroundColor: colors.gray200,
  },
  detailCard: {
    marginTop: 24,
    borderRadius: 24,
    backgroundColor: colors.white,
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 34,
  },
  detailImage: {
    alignSelf: 'center',
    width: 240,
    height: 240,
  },
  detailContent: {
    marginTop: 6,
    gap: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  metaLabel: {
    minWidth: 72,
    color: colors.gray500,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  metaValue: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    flexShrink: 1,
    textAlign: 'right',
  },
  dateValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    flexShrink: 1,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 18,
    lineHeight: 20,
  },
  starFilled: {
    color: colors.yellow500,
  },
  starMuted: {
    color: colors.gray300,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  reviewBody: {
    flex: 1,
    gap: 6,
  },
  reviewText: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  reviewTextMuted: {
    color: colors.gray500,
    fontSize: 16,
    lineHeight: 22,
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
