import type { ImageSourcePropType } from 'react-native';

import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const topChipIcon = require('../../../../assets/images/main/top-chip-icon.png');
const settingsIcon = require('../../../../assets/images/main/settings-icon.png');
const happyBadgeIcon = require('../../../../assets/images/main/happy-badge.png');
const spendTrendDownIcon = require('../../../../assets/images/main/spend-trend-down.png');
const spendTrendUpIcon = require('../../../../assets/images/main/spend-trend-up.png');
const retrospectiveArrowIcon = require('../../../../assets/images/main/retrospective-arrow.png');
const homeIcon = require('../../../../assets/images/tabIcons/home.png');
const aiAdviceIcon = require('../../../../assets/images/tabIcons/explore.png');

const CONNECT_BANK_ROUTE = '/onboarding/connect-bank' as never;
const HAPPY_ARCHIVE_ROUTE = '/insights/archive' as never;
const RETROSPECTIVE_ROUTE = '/retrospective' as never;
const HOME_ROUTE = '/insights' as never;
const MAIN_CHATBOT_ROUTE = '/chatbot/demo-session' as never;
const TAB_BAR_HEIGHT = 90;

const LINKED_HOME_CONTENT = {
  userName: '김주현',
  planLabel: 'Free Plan',
  happyPrompt: '내가 행복했던 소비 내역',
  accountStatus: '전체 계좌와 연결 완료',
  happyCategory: '외식비',
  lastMonthSpend: 1_895_000,
  lastMonthSpendDelta: '-12%',
  lastMonthSaved: 240_000,
  lastMonthSavedDelta: '+22%',
  retrospectiveHeadline: '이번 주의 소비 내역을 다시 돌아보세요.',
  retrospectiveFooter: '구매 경험 되짚고 회고하기',
} as const;

const UNLINKED_HOME_CONTENT = {
  happyPrompt: '내가 행복했던 소비 내역',
  bankLinkTitle: '오픈뱅킹 연동하기',
  bankLinkSubtitle: '최근 3개월 거래를 연결해서 소비 기록을 바로 불러와요.',
  accountStatus: '오픈뱅킹 연결이 필요해요',
  happyMessage: '계좌를 연결하면 만족스러웠던 소비를 바로 모아드릴게요.',
  retrospectiveHeadline: '이번 주의 소비를 회고하려면 계좌 연결을 먼저 완료해주세요.',
  retrospectiveFooter: '계좌 연결하고 회고 준비하기',
} as const;

export function InsightsOverviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onboardingStatus = useAuthStore((state) => state.onboardingStatus);
  const signUpNickname = useAuthStore((state) => state.signUpDraft.nickname);
  const isBankLinked = onboardingStatus === 'NEEDS_LABELING' || onboardingStatus === 'READY';
  const trimmedNickname = signUpNickname.trim();
  const displayName =
    trimmedNickname.length > 0 ? trimmedNickname : LINKED_HOME_CONTENT.userName;

  const handleConnectBank = () => {
    router.push(CONNECT_BANK_ROUTE);
  };

  const handleHappyArchivePress = () => {
    if (!isBankLinked) {
      handleConnectBank();
      return;
    }

    router.push(HAPPY_ARCHIVE_ROUTE);
  };

  const handleRetrospectivePress = () => {
    if (!isBankLinked) {
      handleConnectBank();
      return;
    }

    router.push(RETROSPECTIVE_ROUTE);
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <TopPromptChip
            label={isBankLinked ? LINKED_HOME_CONTENT.happyPrompt : UNLINKED_HOME_CONTENT.happyPrompt}
          />

          <View style={styles.profileRow}>
            <View style={styles.profileCopy}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profilePlan}>{LINKED_HOME_CONTENT.planLabel}</Text>
            </View>

            <Image
              accessible={false}
              resizeMode="contain"
              source={settingsIcon}
              style={styles.settingsIcon}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>행복 소비 찾아보기</Text>

            <View style={styles.happySpendCard}>
              {!isBankLinked ? (
                <View style={styles.bankLinkHeader}>
                  <View style={styles.bankLinkCopy}>
                    <Text style={styles.bankLinkTitle}>{UNLINKED_HOME_CONTENT.bankLinkTitle}</Text>
                    <Text style={styles.bankLinkSubtitle}>
                      {UNLINKED_HOME_CONTENT.bankLinkSubtitle}
                    </Text>
                  </View>

                  <Pressable
                    accessibilityLabel="오픈뱅킹 연결 시작"
                    accessibilityRole="button"
                    hitSlop={10}
                    onPress={handleConnectBank}
                    style={({ pressed }) => [
                      styles.bankLinkButton,
                      pressed && styles.bankLinkButtonPressed,
                    ]}
                  >
                    <Text style={styles.bankLinkButtonLabel}>+</Text>
                  </Pressable>
                </View>
              ) : null}

              <Text style={styles.accountStatus}>
                {isBankLinked
                  ? LINKED_HOME_CONTENT.accountStatus
                  : UNLINKED_HOME_CONTENT.accountStatus}
              </Text>

              <View style={styles.happyInsightRow}>
                <Image
                  accessible={false}
                  resizeMode="contain"
                  source={happyBadgeIcon}
                  style={[styles.happyBadgeIcon, !isBankLinked && styles.happyBadgeIconDisabled]}
                />

                <Text
                  style={isBankLinked ? styles.happyInsightText : styles.happyInsightTextDisabled}
                >
                  {isBankLinked
                    ? `${displayName}님의 행복 소비는 ${LINKED_HOME_CONTENT.happyCategory} 지출입니다.`
                    : UNLINKED_HOME_CONTENT.happyMessage}
                </Text>
              </View>

              {isBankLinked ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={handleHappyArchivePress}
                  style={({ pressed }) => [styles.happyActionButton, pressed && styles.pressed]}
                >
                  <Text style={styles.happyActionLabel}>행복 지출 분석하기</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>소비 내역</Text>

            <View style={styles.metricCard}>
              <MetricRow
                amountLabel={isBankLinked ? formatWon(LINKED_HOME_CONTENT.lastMonthSpend) : '-'}
                deltaLabel={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSpendDelta : undefined}
                deltaTone="negative"
                dimmed={!isBankLinked}
                icon={spendTrendDownIcon}
                label="지난달 소비 내역"
              />

              <View style={styles.metricDivider} />

              <MetricRow
                amountLabel={isBankLinked ? formatWon(LINKED_HOME_CONTENT.lastMonthSaved) : '-'}
                deltaLabel={isBankLinked ? LINKED_HOME_CONTENT.lastMonthSavedDelta : undefined}
                deltaTone="positive"
                dimmed={!isBankLinked}
                icon={spendTrendUpIcon}
                label="지난달 아낀 금액"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>주간 소비 내역 회고</Text>

            <Pressable
              accessibilityRole="button"
              onPress={handleRetrospectivePress}
              style={({ pressed }) => [
                styles.retrospectiveCard,
                !isBankLinked && styles.retrospectiveCardDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={
                  isBankLinked
                    ? styles.retrospectiveHeadline
                    : styles.retrospectiveHeadlineDisabled
                }
              >
                {isBankLinked
                  ? LINKED_HOME_CONTENT.retrospectiveHeadline
                  : UNLINKED_HOME_CONTENT.retrospectiveHeadline}
              </Text>

              <View style={styles.retrospectiveFooter}>
                <Text
                  style={
                    isBankLinked
                      ? styles.retrospectiveFooterLabel
                      : styles.retrospectiveFooterLabelDisabled
                  }
                >
                  {isBankLinked
                    ? LINKED_HOME_CONTENT.retrospectiveFooter
                    : UNLINKED_HOME_CONTENT.retrospectiveFooter}
                </Text>

                <Image
                  accessible={false}
                  resizeMode="contain"
                  source={retrospectiveArrowIcon}
                  style={[
                    styles.retrospectiveArrow,
                    !isBankLinked && styles.retrospectiveArrowDisabled,
                  ]}
                />
              </View>
            </Pressable>
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

type TopPromptChipProps = {
  label: string;
};

function TopPromptChip({ label }: TopPromptChipProps) {
  return (
    <View style={styles.topPromptChip}>
      <Image
        accessible={false}
        resizeMode="contain"
        source={topChipIcon}
        style={styles.topPromptIcon}
      />
      <Text style={styles.topPromptLabel}>{label}</Text>
    </View>
  );
}

type MetricRowProps = {
  label: string;
  amountLabel: string;
  deltaLabel?: string;
  deltaTone: 'negative' | 'positive';
  icon: ImageSourcePropType;
  dimmed?: boolean;
};

function MetricRow({
  label,
  amountLabel,
  deltaLabel,
  deltaTone,
  icon,
  dimmed = false,
}: MetricRowProps) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricSummary}>
        <Image
          accessible={false}
          resizeMode="contain"
          source={icon}
          style={[styles.metricIcon, dimmed && styles.metricIconDimmed]}
        />

        <View style={styles.metricCopy}>
          <Text style={[styles.metricLabel, dimmed && styles.metricLabelDisabled]}>{label}</Text>
          <Text style={[styles.metricAmount, dimmed && styles.metricAmountDisabled]}>
            {amountLabel}
          </Text>
        </View>
      </View>

      {deltaLabel ? (
        <View
          style={[
            styles.metricDeltaBadge,
            deltaTone === 'negative'
              ? styles.metricDeltaBadgeNegative
              : styles.metricDeltaBadgePositive,
          ]}
        >
          <Text
            style={[
              styles.metricDeltaLabel,
              deltaTone === 'negative'
                ? styles.metricDeltaLabelNegative
                : styles.metricDeltaLabelPositive,
            ]}
          >
            {deltaLabel}
          </Text>
        </View>
      ) : null}
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
      style={({ pressed }) => [styles.bottomTab, pressed && styles.pressed]}
    >
      <Image
        accessible={false}
        resizeMode="contain"
        source={icon}
        style={[
          styles.bottomTabIcon,
          isActive ? styles.bottomTabIconActive : styles.bottomTabIconInactive,
        ]}
      />
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

function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 24,
  },
  topPromptChip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingLeft: 8,
    paddingRight: 14,
    paddingVertical: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  topPromptIcon: {
    width: 24,
    height: 24,
  },
  topPromptLabel: {
    color: colors.gray900,
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
    gap: 2,
  },
  profileName: {
    color: colors.gray900,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  profilePlan: {
    color: colors.gray400,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.gray900,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  happySpendCard: {
    minHeight: 180,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 22,
  },
  bankLinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankLinkCopy: {
    flex: 1,
    gap: 4,
  },
  bankLinkTitle: {
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  bankLinkSubtitle: {
    color: colors.gray500,
    fontSize: 13,
    lineHeight: 19,
  },
  bankLinkButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: colors.mint400,
  },
  bankLinkButtonPressed: {
    opacity: 0.82,
  },
  bankLinkButtonLabel: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 28,
    marginTop: -2,
  },
  accountStatus: {
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
  happyBadgeIcon: {
    width: 32,
    height: 32,
  },
  happyBadgeIconDisabled: {
    opacity: 0.35,
  },
  happyInsightText: {
    flex: 1,
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  happyInsightTextDisabled: {
    flex: 1,
    color: colors.gray400,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  happyActionButton: {
    alignSelf: 'center',
    minWidth: 169,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.mint400,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  happyActionLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  metricCard: {
    borderRadius: 12,
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
  metricIcon: {
    width: 24,
    height: 24,
  },
  metricIconDimmed: {
    opacity: 0.35,
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
  metricLabelDisabled: {
    color: colors.gray400,
  },
  metricAmount: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  metricAmountDisabled: {
    color: colors.gray400,
  },
  metricDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
    backgroundColor: colors.gray300,
  },
  metricDeltaBadge: {
    minWidth: 71,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  metricDeltaBadgeNegative: {
    backgroundColor: colors.red100,
  },
  metricDeltaBadgePositive: {
    backgroundColor: colors.mint100,
  },
  metricDeltaLabel: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  metricDeltaLabelNegative: {
    color: colors.red300,
  },
  metricDeltaLabelPositive: {
    color: colors.green500,
  },
  retrospectiveCard: {
    borderRadius: 12,
    backgroundColor: colors.mint400,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 20,
    paddingBottom: 14,
    gap: 36,
  },
  retrospectiveCardDisabled: {
    backgroundColor: colors.gray400,
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
  retrospectiveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  retrospectiveArrow: {
    width: 20,
    height: 20,
  },
  retrospectiveArrowDisabled: {
    opacity: 0.4,
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
  pressed: {
    opacity: 0.78,
  },
});
