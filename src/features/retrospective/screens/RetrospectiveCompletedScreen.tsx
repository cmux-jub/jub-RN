import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function RetrospectiveCompletedScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/retrospective' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" hitSlop={12} onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>행복 지출 분석</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.checkWrap}>
            <Text style={styles.checkMark}>✓</Text>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.title}>행복 소비 분석 완료!</Text>
            <Text style={styles.subtitle}>곧 결과가 나와요!</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
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
  headerTitle: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 84,
    gap: 36,
  },
  checkWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint500,
  },
  checkMark: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 56,
    marginTop: -6,
  },
  copyBlock: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 33,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray400,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    textAlign: 'center',
  },
});
