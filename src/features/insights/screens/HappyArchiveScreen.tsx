import { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { fetchHappyPurchases } from '@/api/insights';
import type { HappyPurchaseItem } from '@/api/types/insights';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { colors } from '@/theme/colors';

const BACK_ICON = '\u2039';
const topChipIcon = require('../../../../assets/images/main/top-chip-icon.png');
const CAKE_IMAGE_URI = 'https://www.figma.com/api/mcp/asset/4934a3ff-3e59-43b0-9726-f24313f3bc47';

const CATEGORY_LABELS = {
  IMMEDIATE: '즉시 소비',
  LASTING: '지속 소비',
  ESSENTIAL: '필수 소비',
} as const;

type ScreenState = 'loading' | 'success' | 'error';

export function HappyArchiveScreen() {
  const router = useRouter();
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [purchase, setPurchase] = useState<HappyPurchaseItem | null>(null);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadHappyPurchases() {
      try {
        const response = await fetchHappyPurchases();

        if (isCancelled) {
          return;
        }

        if (!response.success) {
          setScreenState('error');
          return;
        }

        const firstItem = response.data.items[0] ?? null;
        setPurchase(firstItem);
        setItemCount(response.data.items.length);
        setScreenState('success');

        track(appEvents.archiveViewed, {
          item_count: response.data.items.length,
        });
      } catch {
        if (!isCancelled) {
          setScreenState('error');
        }
      }
    }

    void loadHappyPurchases();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  const noteLines = purchase?.text?.split('\n').filter((line) => line.trim().length > 0) ?? [];

  if (screenState === 'loading') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>행복 소비를 불러오고 있어요.</Text>
          <Text style={styles.emptyBody}>최근 기록된 행복 소비를 정리해서 보여드릴게요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (screenState === 'error') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>행복 소비를 불러오지 못했어요.</Text>
          <Text style={styles.emptyBody}>잠시 후 다시 시도해주세요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!purchase) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>아직 행복 소비 내역이 없어요.</Text>
          <Text style={styles.emptyBody}>
            만족도가 높은 소비가 쌓이면 여기에 바로 보여드릴게요.
          </Text>
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
        </View>

        <View style={styles.topChip}>
          <Image accessible={false} resizeMode="contain" source={topChipIcon} style={styles.topChipIcon} />
          <Text style={styles.topChipLabel}>나의 행복 소비 내역</Text>
        </View>

        <View style={styles.card}>
          <Image resizeMode="contain" source={{ uri: CAKE_IMAGE_URI }} style={styles.cardImage} />

          <View style={styles.metaBlock}>
            <ArchiveRow label="지출 날짜" value={formatArchiveDate(purchase.occurred_at)} />
            <ArchiveRow label="지출 금액" value={formatWon(purchase.amount)} />
            <ArchiveRow label="카테고리" value={CATEGORY_LABELS[purchase.category]} />
          </View>

          <View style={styles.noteBlock}>
            <Text style={styles.noteLabel}>회고</Text>
            {noteLines.length > 0 ? (
              noteLines.map((line) => (
                <Text key={line} style={styles.noteBody}>
                  {line}
                </Text>
              ))
            ) : (
              <Text style={styles.noteBodyMuted}>작성된 회고가 없어요.</Text>
            )}
          </View>
        </View>

        <View style={styles.pagination}>
          <View style={styles.paginationActive} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>

        <Text style={styles.paginationCaption}>행복 소비 {itemCount}건 중 최근 기록</Text>
      </View>
    </SafeAreaView>
  );
}

type ArchiveRowProps = {
  label: string;
  value: string;
};

function ArchiveRow({ label, value }: ArchiveRowProps) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
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
    paddingHorizontal: 20,
  },
  header: {
    height: 48,
    justifyContent: 'center',
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
  topChip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingLeft: 8,
    paddingRight: 18,
    paddingVertical: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.03,
    shadowRadius: 17,
    elevation: 2,
  },
  topChipIcon: {
    width: 24,
    height: 24,
  },
  topChipLabel: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  card: {
    marginTop: 61,
    borderRadius: 24,
    backgroundColor: colors.white,
    paddingTop: 15,
    paddingHorizontal: 12,
    paddingBottom: 34,
  },
  cardImage: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  metaBlock: {
    marginTop: 7,
    gap: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
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
  },
  noteBlock: {
    marginTop: 24,
    gap: 8,
  },
  noteLabel: {
    color: colors.gray500,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  noteBody: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  noteBodyMuted: {
    color: colors.gray500,
    fontSize: 16,
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  paginationActive: {
    width: 16.5,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.mint500,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gray200,
  },
  paginationCaption: {
    marginTop: 12,
    color: colors.gray500,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
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
