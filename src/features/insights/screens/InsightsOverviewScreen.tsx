import type { ImageSourcePropType } from 'react-native';

import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

const homeIcon = require('../../../../assets/images/tabIcons/home.png');
const aiAdviceIcon = require('../../../../assets/images/tabIcons/explore.png');

const TAB_BAR_HEIGHT = 90;
const SCREEN_HORIZONTAL_PADDING = 20;
const SECTION_GAP = 24;
const CARD_RADIUS = 12;

const HOME_CONTENT = {
  prompt: '유가 상승 대비를 위해선?',
  promptProgress: '1/3',
  userName: '김효현',
  planLabel: 'FreePlan',
  accountStatus: '전체 계좌와 연결 완료',
  happyCategory: '“식비”',
  lastMonthSpend: 1_895_000,
  lastMonthSpendDelta: -12,
  lastMonthSaved: 240_000,
  lastMonthSavedDelta: 22,
  retrospectiveProduct: '에어팟 프로3',
} as const;

type TrendDirection = 'down' | 'up';

export function InsightsOverviewScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 28 },
          ]}
        >
          <PromptChip />

          <View style={styles.profileRow}>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{HOME_CONTENT.userName}</Text>
              <Text style={styles.profilePlan}>{HOME_CONTENT.planLabel}</Text>
            </View>
            <Text accessibilityRole="image" style={styles.settingsIcon}>
              ⚙
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>행복 소비 찾아보기</Text>
            <View style={styles.primaryCard}>
              <Text style={styles.mutedCaption}>{HOME_CONTENT.accountStatus}</Text>

              <View style={styles.happyInsightRow}>
                <HappyBadge />
                <Text style={styles.happyInsightText}>
                  {`${HOME_CONTENT.userName}님의 행복 소비는 ${HOME_CONTENT.happyCategory} 지출입니다.`}
                </Text>
              </View>

              <Pressable accessibilityRole="button" onPress={noop} style={styles.primaryAction}>
                <Text style={styles.primaryActionLabel}>행복 지출 분석하기</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>소비 내역</Text>
            <View style={styles.metricCard}>
              <MetricRow
                amount={HOME_CONTENT.lastMonthSpend}
                delta={HOME_CONTENT.lastMonthSpendDelta}
                direction="down"
                label="지난달 소비 내역"
              />
              <View style={styles.metricDivider} />
              <MetricRow
                amount={HOME_CONTENT.lastMonthSaved}
                delta={HOME_CONTENT.lastMonthSavedDelta}
                direction="up"
                label="지난달 아낀 금액"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>주간 소비 내역 회고</Text>
            <Pressable accessibilityRole="button" onPress={noop} style={styles.retrospectiveCard}>
              <Text style={styles.retrospectiveHeadline}>
                이번에 구매하신 <Text style={styles.retrospectiveProduct}>{HOME_CONTENT.retrospectiveProduct}</Text>
                {'\n'}
                구매 경험이 만족스러우셨나요?
              </Text>

              <View style={styles.retrospectiveFooter}>
                <Text style={styles.retrospectiveFooterLabel}>구매 경험 남기고 회고하기</Text>
                <ChevronRight />
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.tabBarRow}>
          <BottomTab icon={homeIcon} isActive label="홈" />
          <BottomTab icon={aiAdviceIcon} isActive={false} label="AI 조언" />
        </View>
      </View>
    </View>
  );
}

type BottomTabProps = {
  label: string;
  isActive: boolean;
  icon: ImageSourcePropType;
};

function BottomTab({ label, isActive, icon }: BottomTabProps) {
  return (
    <View style={styles.bottomTab}>
      <View style={styles.bottomTabIconWrap}>
        <Image
          accessible={false}
          resizeMode="contain"
          source={icon}
          style={[
            styles.bottomTabIcon,
            isActive ? styles.bottomTabIconActive : styles.bottomTabIconInactive,
          ]}
        />
      </View>
      <Text
        style={[
          styles.bottomTabLabel,
          isActive ? styles.bottomTabLabelActive : styles.bottomTabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

type MetricRowProps = {
  label: string;
  amount: number;
  delta: number;
  direction: TrendDirection;
};

function MetricRow({ label, amount, delta, direction }: MetricRowProps) {
  const isPositive = direction === 'up';

  return (
    <View style={styles.metricRow}>
      <View style={styles.metricSummary}>
        <View style={styles.metricIconWrap}>
          <Text style={[styles.metricTrendIcon, isPositive ? styles.metricTrendUp : styles.metricTrendDown]}>
            {isPositive ? '↗' : '↘'}
          </Text>
        </View>

        <View style={styles.metricCopy}>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={styles.metricAmount}>{formatWon(amount)}</Text>
        </View>
      </View>

      <View style={[styles.deltaBadge, isPositive ? styles.deltaBadgePositive : styles.deltaBadgeNegative]}>
        <Text style={[styles.deltaLabel, isPositive ? styles.deltaLabelPositive : styles.deltaLabelNegative]}>
          {formatDelta(delta)}
        </Text>
      </View>
    </View>
  );
}

function PromptChip() {
  return (
    <View style={styles.promptChip}>
      <PromptIcon />
      <Text style={styles.promptText}>{HOME_CONTENT.prompt}</Text>
      <Text style={styles.promptCounter}>{HOME_CONTENT.promptProgress}</Text>
    </View>
  );
}

function PromptIcon() {
  return (
    <View style={styles.promptIconOuter}>
      <View style={styles.promptIconInner} />
      <View style={styles.promptIconGap} />
      <View style={styles.promptIconAccent} />
    </View>
  );
}

function HappyBadge() {
  return (
    <View style={styles.happyBadge}>
      <Text style={styles.happyBadgeLabel}>₩</Text>
    </View>
  );
}

function ChevronRight() {
  return <Text style={styles.chevronRight}>›</Text>;
}

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function formatDelta(delta: number) {
  return `${delta > 0 ? '+' : ''}${delta}%`;
}

function noop() {}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
    paddingTop: 16,
    gap: SECTION_GAP,
  },
  promptChip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingLeft: 8,
    paddingRight: 18,
    paddingVertical: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 17,
    elevation: 1,
  },
  promptIconOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.mint500,
    backgroundColor: colors.white,
    position: 'relative',
    overflow: 'hidden',
  },
  promptIconInner: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 999,
    backgroundColor: colors.white,
  },
  promptIconGap: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 11,
    height: 11,
    borderRadius: 999,
    backgroundColor: colors.white,
  },
  promptIconAccent: {
    position: 'absolute',
    top: 1,
    left: 6,
    width: 8,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#C5D87C',
  },
  promptText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  promptCounter: {
    color: colors.gray400,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileCopy: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  profileName: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  profilePlan: {
    color: colors.gray400,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 4,
  },
  settingsIcon: {
    color: colors.gray400,
    fontSize: 26,
    lineHeight: 26,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  primaryCard: {
    minHeight: 180,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 22,
    gap: 22,
  },
  mutedCaption: {
    color: colors.gray400,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  happyInsightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  happyInsightText: {
    flex: 1,
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  happyBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.yellow300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  happyBadgeLabel: {
    color: colors.yellow500,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  primaryAction: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 168,
    borderRadius: 8,
    backgroundColor: colors.mint400,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primaryActionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  metricCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  metricRow: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  metricSummary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricIconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTrendIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricTrendDown: {
    color: colors.red300,
  },
  metricTrendUp: {
    color: colors.green500,
  },
  metricCopy: {
    gap: 6,
  },
  metricLabel: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  metricAmount: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  metricDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    backgroundColor: colors.gray300,
  },
  deltaBadge: {
    minWidth: 71,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  deltaBadgeNegative: {
    backgroundColor: colors.red100,
  },
  deltaBadgePositive: {
    backgroundColor: colors.mint100,
  },
  deltaLabel: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  deltaLabelNegative: {
    color: colors.red300,
  },
  deltaLabelPositive: {
    color: colors.green500,
  },
  retrospectiveCard: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.mint400,
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 12,
  },
  retrospectiveHeadline: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  retrospectiveProduct: {
    fontWeight: '700',
  },
  retrospectiveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  retrospectiveFooterLabel: {
    color: colors.gray600,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  chevronRight: {
    color: colors.gray600,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: -1,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    paddingTop: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 10,
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 80,
  },
  bottomTab: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bottomTabIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabIcon: {
    width: 24,
    height: 24,
  },
  bottomTabIconActive: {
    tintColor: colors.gray700,
  },
  bottomTabIconInactive: {
    tintColor: colors.gray300,
  },
  bottomTabLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  bottomTabLabelActive: {
    color: colors.gray700,
  },
  bottomTabLabelInactive: {
    color: colors.gray300,
  },
});
