import type { ImageSourcePropType } from 'react-native';

import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const homeIcon = require('../../../../assets/images/tabIcons/home.png');
const aiAdviceIcon = require('../../../../assets/images/tabIcons/explore.png');

const CONNECT_BANK_ROUTE = '/onboarding/connect-bank' as never;
const HOME_ROUTE = '/insights' as never;
const MAIN_CHATBOT_ROUTE = '/chatbot/demo-session' as never;
const TAB_BAR_HEIGHT = 90;
const SCREEN_HORIZONTAL_PADDING = 20;
const SECTION_GAP = 24;
const CARD_RADIUS = 12;

const LINKED_HOME_CONTENT = {
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

const UNLINKED_HOME_CONTENT = {
  prompt: '내가 잘 쓴 소비내역',
  bankLinkTitle: '오픈 뱅킹 연동하기',
  emptyMessage: '아직 연결된 계좌가 없어요.',
  retrospectiveTitle: '오픈 뱅킹을 연동해주세요.',
  retrospectiveCaption: '오픈 뱅킹 연동하고 돈도 줍고, 행복도 줍기',
} as const;

type TrendDirection = 'down' | 'up';

export function InsightsOverviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onboardingStatus = useAuthStore((state) => state.onboardingStatus);
  const isBankLinked = onboardingStatus !== 'NEEDS_BANK_LINK';

  const handleConnectBank = () => {
    router.push(CONNECT_BANK_ROUTE);
  };

  const handleHomePress = () => {
    router.replace(HOME_ROUTE);
  };

  const handleChatPress = () => {
    router.push(MAIN_CHATBOT_ROUTE);
  };

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
          <PromptChip
            counter={isBankLinked ? LINKED_HOME_CONTENT.promptProgress : undefined}
            prompt={isBankLinked ? LINKED_HOME_CONTENT.prompt : UNLINKED_HOME_CONTENT.prompt}
          />

          <View style={styles.profileRow}>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{LINKED_HOME_CONTENT.userName}</Text>
              <Text style={styles.profilePlan}>{LINKED_HOME_CONTENT.planLabel}</Text>
            </View>
            <Text accessibilityRole="image" style={styles.settingsIcon}>
              ⚙
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>행복 소비 찾아보기</Text>
            {isBankLinked ? (
              <LinkedHappySpendCard />
            ) : (
              <UnlinkedHappySpendCard onConnectBank={handleConnectBank} />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>소비 내역</Text>
            <View style={styles.metricCard}>
              <MetricRow
                amount={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSpend : 0}
                delta={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSpendDelta : undefined}
                direction="down"
                label="지난달 소비 내역"
                showIndicator={isBankLinked}
              />
              <View style={styles.metricDivider} />
              <MetricRow
                amount={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSaved : 0}
                delta={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSavedDelta : undefined}
                direction="up"
                label="지난달 아낀 금액"
                showIndicator={isBankLinked}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>주간 소비 내역 회고</Text>
            {isBankLinked ? (
              <Pressable accessibilityRole="button" onPress={noop} style={styles.retrospectiveCard}>
                <Text style={styles.retrospectiveHeadline}>
                  이번에 구매하신{' '}
                  <Text style={styles.retrospectiveProduct}>
                    {LINKED_HOME_CONTENT.retrospectiveProduct}
                  </Text>
                  {'\n'}
                  구매 경험이 만족스러우셨나요?
                </Text>

                <View style={styles.retrospectiveFooter}>
                  <Text style={styles.retrospectiveFooterLabel}>구매 경험 남기고 회고하기</Text>
                  <ChevronRight color={colors.gray600} />
                </View>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={handleConnectBank}
                style={styles.retrospectiveCardDisabled}
              >
                <Text style={styles.retrospectiveHeadlineDisabled}>
                  {UNLINKED_HOME_CONTENT.retrospectiveTitle}
                </Text>

                <View style={styles.retrospectiveFooter}>
                  <Text style={styles.retrospectiveFooterLabelDisabled}>
                    {UNLINKED_HOME_CONTENT.retrospectiveCaption}
                  </Text>
                  <ChevronRight color={colors.gray200} />
                </View>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.tabBarRow}>
          <BottomTab icon={homeIcon} isActive label="홈" onPress={handleHomePress} />
          <BottomTab
            icon={aiAdviceIcon}
            isActive={false}
            label="AI 조언"
            onPress={handleChatPress}
          />
        </View>
      </View>
    </View>
  );
}

function LinkedHappySpendCard() {
  return (
    <View style={styles.primaryCard}>
      <Text style={styles.mutedCaption}>{LINKED_HOME_CONTENT.accountStatus}</Text>

      <View style={styles.happyInsightRow}>
        <HappyBadge variant="linked" />
        <Text style={styles.happyInsightText}>
          {`${LINKED_HOME_CONTENT.userName}님의 행복 소비는 ${LINKED_HOME_CONTENT.happyCategory} 지출입니다.`}
        </Text>
      </View>

      <Pressable accessibilityRole="button" onPress={noop} style={styles.primaryAction}>
        <Text style={styles.primaryActionLabel}>행복 지출 분석하기</Text>
      </Pressable>
    </View>
  );
}

type UnlinkedHappySpendCardProps = {
  onConnectBank: () => void;
};

function UnlinkedHappySpendCard({ onConnectBank }: UnlinkedHappySpendCardProps) {
  return (
    <View style={styles.primaryCard}>
      <Pressable accessibilityRole="button" onPress={onConnectBank} style={styles.bankLinkRow}>
        <Text style={styles.bankLinkTitle}>{UNLINKED_HOME_CONTENT.bankLinkTitle}</Text>
        <Text style={styles.bankLinkPlus}>+</Text>
      </Pressable>

      <View style={styles.happyInsightRow}>
        <HappyBadge variant="unlinked" />
        <Text style={styles.happyInsightTextDisabled}>{UNLINKED_HOME_CONTENT.emptyMessage}</Text>
      </View>

      <View style={styles.primaryActionDisabled}>
        <Text style={styles.primaryActionLabelDisabled}>행복 지출 분석하기</Text>
      </View>
    </View>
  );
}

type BottomTabProps = {
  label: string;
  isActive: boolean;
  icon: ImageSourcePropType;
  onPress: () => void;
};

function BottomTab({ label, isActive, icon, onPress }: BottomTabProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.bottomTab, pressed && styles.bottomTabPressed]}
    >
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
    </Pressable>
  );
}

type MetricRowProps = {
  label: string;
  amount: number;
  delta?: number;
  direction: TrendDirection;
  showIndicator: boolean;
};

function MetricRow({ label, amount, delta, direction, showIndicator }: MetricRowProps) {
  const isPositive = direction === 'up';

  return (
    <View style={styles.metricRow}>
      <View style={styles.metricSummary}>
        {showIndicator ? (
          <View style={styles.metricIconWrap}>
            <Text
              style={[
                styles.metricTrendIcon,
                isPositive ? styles.metricTrendUp : styles.metricTrendDown,
              ]}
            >
              {isPositive ? '↗' : '↘'}
            </Text>
          </View>
        ) : null}

        <View style={styles.metricCopy}>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={styles.metricAmount}>{formatWon(amount)}</Text>
        </View>
      </View>

      {showIndicator && typeof delta === 'number' ? (
        <View
          style={[
            styles.deltaBadge,
            isPositive ? styles.deltaBadgePositive : styles.deltaBadgeNegative,
          ]}
        >
          <Text
            style={[
              styles.deltaLabel,
              isPositive ? styles.deltaLabelPositive : styles.deltaLabelNegative,
            ]}
          >
            {formatDelta(delta)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

type PromptChipProps = {
  prompt: string;
  counter?: string;
};

function PromptChip({ prompt, counter }: PromptChipProps) {
  return (
    <View style={styles.promptChip}>
      <PromptIcon />
      <Text style={styles.promptText}>{prompt}</Text>
      {counter ? <Text style={styles.promptCounter}>{counter}</Text> : null}
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

type HappyBadgeProps = {
  variant: 'linked' | 'unlinked';
};

function HappyBadge({ variant }: HappyBadgeProps) {
  const isLinked = variant === 'linked';

  return (
    <View style={[styles.happyBadge, isLinked ? styles.happyBadgeLinked : styles.happyBadgeUnlinked]}>
      <Text
        style={[
          styles.happyBadgeLabel,
          isLinked ? styles.happyBadgeLabelLinked : styles.happyBadgeLabelUnlinked,
        ]}
      >
        ₩
      </Text>
    </View>
  );
}

type ChevronRightProps = {
  color: string;
};

function ChevronRight({ color }: ChevronRightProps) {
  return <Text style={[styles.chevronRight, { color }]}>›</Text>;
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
  bankLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankLinkTitle: {
    color: colors.gray400,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  bankLinkPlus: {
    color: colors.gray400,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 24,
    marginTop: -4,
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
  happyInsightTextDisabled: {
    flex: 1,
    color: colors.gray300,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  happyBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  happyBadgeLinked: {
    backgroundColor: colors.yellow300,
  },
  happyBadgeUnlinked: {
    backgroundColor: colors.gray300,
  },
  happyBadgeLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  happyBadgeLabelLinked: {
    color: colors.yellow500,
  },
  happyBadgeLabelUnlinked: {
    color: colors.gray50,
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
  primaryActionDisabled: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 168,
    borderRadius: 8,
    backgroundColor: colors.gray200,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primaryActionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  primaryActionLabelDisabled: {
    color: colors.gray400,
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
  retrospectiveCardDisabled: {
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.gray400,
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
  retrospectiveHeadlineDisabled: {
    color: colors.gray100,
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
  retrospectiveFooterLabelDisabled: {
    color: colors.gray200,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  chevronRight: {
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
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  bottomTabPressed: {
    opacity: 0.7,
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
