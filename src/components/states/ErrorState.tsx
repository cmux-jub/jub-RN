import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type ErrorStateProps = {
  code: string;
  message: string;
};

export function ErrorState({ code, message }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.code}>{code}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  code: {
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
