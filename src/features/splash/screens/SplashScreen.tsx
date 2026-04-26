import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

import { APP_NAME } from '@/constants/app';
import { colors } from '@/theme/colors';

const splashLogo = require('../../../../assets/images/joob-splash-logo.png');
const splashWordmark = require('../../../../assets/images/joob-splash-wordmark.png');

const FIGMA_SCREEN_HEIGHT = 852;
const LOGO_TOP_RATIO = 326 / FIGMA_SCREEN_HEIGHT;
const WORDMARK_BOTTOM_RATIO = 80 / FIGMA_SCREEN_HEIGHT;
const SPLASH_REDIRECT_DELAY_MS = 1600;

export function SplashScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace('/onboarding');
    }, SPLASH_REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [router]);

  const logoTop = Math.max(220, Math.round(height * LOGO_TOP_RATIO));
  const wordmarkBottom = Math.max(64, Math.round(height * WORDMARK_BOTTOM_RATIO));

  return (
    <View accessibilityLabel={`${APP_NAME} splash screen`} accessible style={styles.screen}>
      <View pointerEvents="none" style={[styles.logoContainer, { top: logoTop }]}>
        <Image
          accessibilityIgnoresInvertColors
          accessible={false}
          resizeMode="contain"
          source={splashLogo}
          style={styles.logo}
        />
      </View>

      <View pointerEvents="none" style={[styles.wordmarkContainer, { bottom: wordmarkBottom }]}>
        <Image
          accessibilityIgnoresInvertColors
          accessible={false}
          resizeMode="contain"
          source={splashWordmark}
          style={styles.wordmark}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 100,
    height: 100,
  },
  wordmarkContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  wordmark: {
    width: 82,
    height: 24,
  },
});
