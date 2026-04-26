import type { PropsWithChildren } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type SectionCardProps = PropsWithChildren<{
  title: string;
}>;

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.lg,
    backgroundColor: colors.gray100,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    gap: spacing.sm,
  },
});
