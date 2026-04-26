import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  title: {
    color: colors.gray800,
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 21,
  },
});
