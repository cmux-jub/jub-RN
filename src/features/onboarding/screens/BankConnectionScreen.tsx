import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';

import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchCurrentUser } from '@/api/auth';
import { completeBankOAuth, startBankOAuth, syncTransactions } from '@/api/banking';
import type { LinkedAccount } from '@/api/types/banking';
import { SectionCard } from '@/components/ui/SectionCard';
import { getAuthErrorMessage, resolvePostAuthRoute } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type FlowPhase =
  | 'idle'
  | 'starting'
  | 'waiting'
  | 'completing'
  | 'syncing'
  | 'success'
  | 'error';

type SyncSummary = {
  syncedCount: number;
  newCount: number;
};

const BANKING_PROVIDER = 'OPEN_BANKING_KR' as const;
const FALLBACK_ROUTE = '/insights' as const;

const COPY = {
  title: '오픈뱅킹 연결',
  eyebrow: 'Onboarding',
  headline: '계좌를 연결하고 최근 소비를 바로 불러오세요.',
  description:
    '오픈뱅킹 인증이 끝나면 최근 3개월 거래를 동기화하고, 다음 온보딩 단계로 이어집니다.',
  webHint: '이 플로우는 앱 또는 에뮬레이터에서 테스트하는 기준으로 구현되어 있습니다.',
  accountSectionTitle: '연결된 계좌',
  syncSectionTitle: '동기화 결과',
  callbackMissing:
    '인증 결과를 확인하지 못했어요. 브라우저를 닫지 말고 다시 시도해주세요.',
  authCancelled: '오픈뱅킹 인증이 취소되었어요. 다시 시도해주세요.',
} as const;

export function BankConnectionScreen() {
  const router = useRouter();
  const onboardingStatus = useAuthStore((state) => state.onboardingStatus);

  const [phase, setPhase] = useState<FlowPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [syncSummary, setSyncSummary] = useState<SyncSummary | null>(null);
  const [nextRoute, setNextRoute] = useState<string>(FALLBACK_ROUTE);

  const hasAutoStartedRef = useRef(false);
  const pendingStateTokenRef = useRef<string | null>(null);
  const handledCallbackUrlRef = useRef<string | null>(null);

  const isBusy =
    phase === 'starting' ||
    phase === 'waiting' ||
    phase === 'completing' ||
    phase === 'syncing';
  const needsSyncRetry = phase === 'error' && linkedAccounts.length > 0 && syncSummary === null;

  const statusCopy = useMemo(() => {
    switch (phase) {
      case 'starting':
        return {
          title: '연결을 준비하고 있어요',
          body: '오픈뱅킹 인증 주소를 받아오고 있습니다.',
        };
      case 'waiting':
        return {
          title: '브라우저에서 인증을 완료해주세요',
          body: '인증이 끝나면 앱으로 돌아와서 계좌 연결을 마무리합니다.',
        };
      case 'completing':
        return {
          title: '계좌 연결을 확인하고 있어요',
          body: 'OAuth callback 응답을 확인한 뒤 연결된 계좌를 정리합니다.',
        };
      case 'syncing':
        return {
          title: '최근 거래를 동기화하고 있어요',
          body: '최근 3개월 거래를 불러와 다음 화면에서 바로 사용할 수 있게 준비합니다.',
        };
      case 'success':
        return {
          title: '오픈뱅킹 연결이 완료됐어요',
          body: '계좌 연결과 거래 동기화가 끝났습니다. 다음 단계로 이동할 수 있어요.',
        };
      case 'error':
        return {
          title: needsSyncRetry
            ? '계좌는 연결됐지만 동기화가 멈췄어요'
            : '오픈뱅킹 연결을 완료하지 못했어요',
          body:
            errorMessage ??
            '잠시 후 다시 시도해주세요. 문제가 반복되면 인증을 처음부터 다시 시작하세요.',
        };
      case 'idle':
      default:
        return {
          title: '계좌 연결을 시작할 준비가 되었어요',
          body: '버튼을 누르면 외부 인증 화면으로 이동합니다.',
        };
    }
  }, [errorMessage, needsSyncRetry, phase]);

  const primaryButtonLabel =
    phase === 'success'
      ? nextRoute === '/onboarding/labeling'
        ? '소비 회고 이어가기'
        : '메인으로 돌아가기'
      : needsSyncRetry
        ? '거래 다시 불러오기'
        : '오픈뱅킹 연결 시작';

  const updateCurrentUserState = async () => {
    const response = await fetchCurrentUser();

    if (!response.success) {
      throw new Error(response.error.message);
    }

    const nickname = response.data.nickname.trim();

    useAuthStore.setState((state) => ({
      ...state,
      onboardingStatus: response.data.onboarding_status,
      subscriptionTier: response.data.subscription_tier,
      signUpDraft: nickname
        ? {
            ...state.signUpDraft,
            nickname,
          }
        : state.signUpDraft,
    }));

    return response.data.onboarding_status;
  };

  const runTransactionSync = async () => {
    const response = await syncTransactions(buildRecentQuarterSyncPayload());

    if (!response.success) {
      throw new Error(response.error.message);
    }

    const summary = {
      syncedCount: response.data.synced_count,
      newCount: response.data.new_count,
    };

    setSyncSummary(summary);
    return summary;
  };

  const syncLinkedData = async () => {
    setPhase('syncing');
    setErrorMessage(null);

    const resolvedOnboardingStatus = await updateCurrentUserState();
    await runTransactionSync();
    setNextRoute(resolvePostAuthRoute(resolvedOnboardingStatus));
    setPhase('success');
  };

  const beginOAuth = useCallback(async () => {
    setErrorMessage(null);
    setSyncSummary(null);

    if (!needsSyncRetry) {
      setLinkedAccounts([]);
    }

    setPhase('starting');

    try {
      const response = await startBankOAuth({ provider: BANKING_PROVIDER });

      if (!response.success) {
        setPhase('error');
        setErrorMessage(response.error.message);
        return;
      }

      pendingStateTokenRef.current = response.data.state_token;
      setPhase('waiting');
      await Linking.openURL(response.data.auth_url);
    } catch (error) {
      setPhase('error');
      setErrorMessage(
        getAuthErrorMessage(error, '오픈뱅킹 인증을 시작하지 못했어요. 잠시 후 다시 시도해주세요.'),
      );
    }
  }, [needsSyncRetry]);

  const completeOAuthRoundTrip = async (code: string, stateToken: string) => {
    setErrorMessage(null);
    setPhase('completing');

    let resolvedAccounts: LinkedAccount[] = [];

    try {
      const response = await completeBankOAuth({
        code,
        state_token: stateToken,
      });

      if (!response.success) {
        setPhase('error');
        setErrorMessage(response.error.message);
        return;
      }

      resolvedAccounts = response.data.linked_accounts;
      setLinkedAccounts(resolvedAccounts);
      pendingStateTokenRef.current = null;

      await syncLinkedData();
    } catch (error) {
      setPhase('error');
      setErrorMessage(
        getAuthErrorMessage(
          error,
          resolvedAccounts.length > 0
            ? '계좌 연결은 완료됐지만 거래를 불러오지 못했어요. 다시 시도해주세요.'
            : '오픈뱅킹 인증을 완료하지 못했어요. 다시 시도해주세요.',
        ),
      );
    }
  };

  const handleIncomingUrl = useEffectEvent(async (incomingUrl: string) => {
    if (!incomingUrl || handledCallbackUrlRef.current === incomingUrl) {
      return;
    }

    const parsed = Linking.parse(incomingUrl);
    const code = readQueryValue(parsed.queryParams?.code);
    const providerError = readQueryValue(parsed.queryParams?.error);
    const providerErrorDescription =
      readQueryValue(parsed.queryParams?.error_description) ??
      readQueryValue(parsed.queryParams?.error_message);
    const returnedStateToken =
      readQueryValue(parsed.queryParams?.state_token) ?? readQueryValue(parsed.queryParams?.state);

    if (!code && !providerError) {
      return;
    }

    handledCallbackUrlRef.current = incomingUrl;

    if (providerError) {
      setPhase('error');
      setErrorMessage(providerErrorDescription ?? COPY.authCancelled);
      return;
    }

    const stateToken = returnedStateToken ?? pendingStateTokenRef.current;

    if (!code || !stateToken) {
      setPhase('error');
      setErrorMessage(COPY.callbackMissing);
      return;
    }

    await completeOAuthRoundTrip(code, stateToken);
  });

  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      void handleIncomingUrl(event.url);
    });

    void Linking.getInitialURL().then((incomingUrl) => {
      if (!incomingUrl) {
        return;
      }

      return handleIncomingUrl(incomingUrl);
    });

    return () => {
      subscription.remove();
    };
  }, [handleIncomingUrl]);

  useEffect(() => {
    if (onboardingStatus !== 'NEEDS_BANK_LINK' || hasAutoStartedRef.current) {
      return;
    }

    hasAutoStartedRef.current = true;
    void beginOAuth();
  }, [beginOAuth, onboardingStatus]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(FALLBACK_ROUTE as never);
  };

  const handlePrimaryAction = () => {
    if (phase === 'success') {
      router.replace(nextRoute as never);
      return;
    }

    if (needsSyncRetry) {
      void syncLinkedData();
      return;
    }

    void beginOAuth();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="뒤로가기"
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{COPY.title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroBlock}>
          <Text style={styles.eyebrow}>{COPY.eyebrow}</Text>
          <Text style={styles.headline}>{COPY.headline}</Text>
          <Text style={styles.description}>{COPY.description}</Text>
        </View>

        <View style={[styles.statusCard, phase === 'error' && styles.statusCardError]}>
          <View style={styles.statusHeader}>
            {isBusy ? (
              <ActivityIndicator color={colors.mint500} />
            ) : (
              <View
                style={[
                  styles.statusDot,
                  phase === 'success'
                    ? styles.statusDotSuccess
                    : phase === 'error'
                      ? styles.statusDotError
                      : styles.statusDotIdle,
                ]}
              />
            )}
            <Text style={styles.statusTitle}>{statusCopy.title}</Text>
          </View>
          <Text style={styles.statusBody}>{statusCopy.body}</Text>
        </View>

        {linkedAccounts.length > 0 ? (
          <SectionCard title={COPY.accountSectionTitle}>
            {linkedAccounts.map((account) => (
              <View key={account.account_id} style={styles.accountRow}>
                <View style={styles.accountCopy}>
                  <Text style={styles.accountBankName}>{account.bank_name}</Text>
                  <Text style={styles.accountNumber}>{account.masked_number}</Text>
                </View>
                <Text style={styles.accountBadge}>연결됨</Text>
              </View>
            ))}
          </SectionCard>
        ) : null}

        {syncSummary ? (
          <SectionCard title={COPY.syncSectionTitle}>
            <View style={styles.syncRow}>
              <Text style={styles.syncLabel}>동기화된 거래</Text>
              <Text style={styles.syncValue}>{syncSummary.syncedCount.toLocaleString('ko-KR')}건</Text>
            </View>
            <View style={styles.syncRow}>
              <Text style={styles.syncLabel}>새로 추가된 거래</Text>
              <Text style={styles.syncValue}>{syncSummary.newCount.toLocaleString('ko-KR')}건</Text>
            </View>
          </SectionCard>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={isBusy}
            onPress={handlePrimaryAction}
            style={({ pressed }) => [
              styles.primaryButton,
              isBusy && styles.primaryButtonDisabled,
              pressed && !isBusy && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>{primaryButtonLabel}</Text>
          </Pressable>

          <Text style={styles.helperText}>{COPY.webHint}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function readQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

function buildRecentQuarterSyncPayload() {
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setMonth(fromDate.getMonth() - 3);

  return {
    from_date: formatLocalDate(fromDate),
    to_date: formatLocalDate(toDate),
  };
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
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
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 28,
  },
  headerTitle: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  heroBlock: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.mint500,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  headline: {
    color: colors.gray900,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  description: {
    color: colors.gray600,
    fontSize: 15,
    lineHeight: 22,
  },
  statusCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusCardError: {
    borderWidth: 1,
    borderColor: colors.red300,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  statusDotIdle: {
    backgroundColor: colors.gray300,
  },
  statusDotSuccess: {
    backgroundColor: colors.mint500,
  },
  statusDotError: {
    backgroundColor: colors.red300,
  },
  statusTitle: {
    flex: 1,
    color: colors.gray900,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  statusBody: {
    color: colors.gray600,
    fontSize: 15,
    lineHeight: 22,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  accountCopy: {
    flex: 1,
    gap: 2,
  },
  accountBankName: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  accountNumber: {
    color: colors.gray500,
    fontSize: 14,
    lineHeight: 20,
  },
  accountBadge: {
    color: colors.mint500,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  syncLabel: {
    flex: 1,
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 20,
  },
  syncValue: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  footer: {
    gap: spacing.sm,
  },
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.black,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  helperText: {
    color: colors.gray500,
    fontSize: 12,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.8,
  },
});
