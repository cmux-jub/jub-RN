import type { Href } from 'expo-router';

import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type RouteLinkCardProps = {
  href: Href;
  title: string;
  subtitle: string;
  file: string;
};

export function RouteLinkCard({ href, title, subtitle, file }: RouteLinkCardProps) {
  return (
    <Link href={href} style={styles.link}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.file}>{file}</Text>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'none',
  },
  card: {
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.lg,
    backgroundColor: colors.gray100,
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.gray700,
    fontSize: 14,
    lineHeight: 21,
  },
  file: {
    color: colors.gray500,
    fontSize: 12,
    lineHeight: 18,
  },
});
