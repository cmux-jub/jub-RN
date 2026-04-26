import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

type UsageLimitBannerProps = {
  remainingFullSessions: number;
};

export function UsageLimitBanner({ remainingFullSessions }: UsageLimitBannerProps) {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Freemium checkpoint</Text>
      <Text style={styles.body}>
        Remaining full chatbot sessions: {remainingFullSessions}. After the first five
        sessions, insight surfaces can switch to a limited state.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radius.lg,
    backgroundColor: colors.gray100,
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.gray900,
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    color: colors.gray700,
    fontSize: 14,
    lineHeight: 21,
  },
});
