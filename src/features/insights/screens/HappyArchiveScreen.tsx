import { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { mockHappyPurchases } from '@/mocks/fixtures';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { colors } from '@/theme/colors';

const BACK_ICON = '\u2039';
const topChipIcon = require('../../../../assets/images/main/top-chip-icon.png');
const CAKE_IMAGE_URI = 'https://www.figma.com/api/mcp/asset/4934a3ff-3e59-43b0-9726-f24313f3bc47';

const CATEGORY_LABELS = {
  IMMEDIATE: '식비',
  LASTING: '지속 소비',
  ESSENTIAL: '필수 소비',
} as const;

export function HappyArchiveScreen() {
  const router = useRouter();
  const purchase = mockHappyPurchases.items[0] ?? null;
  const noteLines = purchase?.text?.split('\n').filter((line) => line.trim().length > 0) ?? [];

  useEffect(() => {
    track(appEvents.archiveViewed, {
      item_count: mockHappyPurchases.items.length,
    });
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  if (!purchase) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>아직 행복 소비 내역이 없어요</Text>
          <Text style={styles.emptyBody}>행복 점수가 높은 소비가 쌓이면 여기서 바로 보여드릴게요.</Text>
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
          <Text style={styles.topChipLabel}>나의 행복 소비내역</Text>
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
            {noteLines.map((line) => (
              <Text key={line} style={styles.noteBody}>
                {line}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.pagination}>
          <View style={styles.paginationActive} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>
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
