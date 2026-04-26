import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { resolvePostAuthRoute } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const signupCompleteLoader = require('../../../../assets/images/signup-complete-loader.png');

const FIGMA_SCREEN_HEIGHT = 852;
const LOADER_TOP_RATIO = 326 / FIGMA_SCREEN_HEIGHT;
const AUTO_REDIRECT_DELAY_MS = 1200;

export function SignUpCompleteScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { onboardingStatus, clearSignUpDraft } = useAuthStore();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loopAnimation.start();

    const timeout = setTimeout(() => {
      clearSignUpDraft();

      if (!onboardingStatus) {
        router.replace('/login' as never);
        return;
      }

      router.replace(resolvePostAuthRoute(onboardingStatus) as never);
    }, AUTO_REDIRECT_DELAY_MS);

    return () => {
      loopAnimation.stop();
      clearTimeout(timeout);
    };
  }, [clearSignUpDraft, onboardingStatus, rotation, router]);

  const loaderTop = Math.max(280, Math.round(height * LOADER_TOP_RATIO));
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <Animated.Image
        resizeMode="contain"
        source={signupCompleteLoader}
        style={[
          styles.loader,
          {
            top: loaderTop,
            transform: [{ rotate: spin }],
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loader: {
    position: 'absolute',
    left: '50%',
    marginLeft: -50,
    width: 100,
    height: 100,
  },
});
