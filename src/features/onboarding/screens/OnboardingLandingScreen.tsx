import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

const splashLogo = require('../../../../assets/images/joob-splash-logo.png');

const FIGMA_SCREEN_HEIGHT = 852;
const LOGO_TOP_RATIO = 68 / FIGMA_SCREEN_HEIGHT;
const HEADLINE_TOP_RATIO = 347 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 46 / FIGMA_SCREEN_HEIGHT;

export function OnboardingLandingScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  const logoTop = Math.max(44, Math.round(height * LOGO_TOP_RATIO));
  const headlineTop = Math.max(264, Math.round(height * HEADLINE_TOP_RATIO));
  const ctaBottom = Math.max(28, Math.round(height * CTA_BOTTOM_RATIO));

  const handleContinue = () => {
    router.push('/login' as never);
  };

  const handleSignUp = () => {
    router.push('/signup/email' as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View pointerEvents="none" style={[styles.logoContainer, { top: logoTop }]}>
          <Image
            accessibilityIgnoresInvertColors
            accessible={false}
            resizeMode="contain"
            source={splashLogo}
            style={styles.logo}
          />
        </View>

        <View style={[styles.headlineContainer, { top: headlineTop }]}>
          <Text style={styles.headline}>
            <Text style={styles.headlineStrong}>돈도</Text> 줍고,
            {'\n'}
            <Text style={styles.headlineStrong}>행복도</Text> 줍게 도와드릴게요.
          </Text>
        </View>

        <View style={[styles.ctaContainer, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            onPress={handleContinue}
            style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
          >
            <Text style={styles.startButtonLabel}>시작하기</Text>
          </Pressable>

          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>계정이 없으신가요?</Text>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleSignUp}
              style={({ pressed }) => pressed && styles.signUpPressed}
            >
              <Text style={styles.signUpLink}>회원가입</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  headlineContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  headline: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 33,
    letterSpacing: -0.6,
  },
  headlineStrong: {
    fontWeight: '600',
  },
  ctaContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 20,
  },
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderRadius: 9999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  startButtonPressed: {
    opacity: 0.84,
  },
  startButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  signUpPrompt: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  signUpLink: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  signUpPressed: {
    opacity: 0.72,
  },
});
