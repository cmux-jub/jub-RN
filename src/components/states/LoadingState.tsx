import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type LoadingStateProps = {
  label: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Loading</Text>
      <Text style={styles.text}>{label}</Text>
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
  text: {
    color: colors.gray600,
    fontSize: 14,
    lineHeight: 21,
  },
});
