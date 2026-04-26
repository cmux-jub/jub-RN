import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type DataGapStateProps = {
  message: string;
};

export function DataGapState({ message }: DataGapStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Data gap</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    color: colors.gray800,
    fontSize: 13,
    fontWeight: '700',
  },
  message: {
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 21,
  },
});
