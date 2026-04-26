import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { resolvePostAuthRoute } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const signupCompleteLoader = require('../../../../assets/images/signup-complete-loader.png');
const signupCompleteCheck = require('../../../../assets/images/signup-complete-check.png');

const FIGMA_SCREEN_HEIGHT = 852;
const CONTENT_TOP_RATIO = 328 / FIGMA_SCREEN_HEIGHT;
const SPINNER_DURATION_MS = 1200;
const COMPLETE_HOLD_DURATION_MS = 1000;

const COPY = {
  title: '\uD68C\uC6D0\uAC00\uC785 \uC644\uB8CC!',
  prefixStrong: '\uB3C8',
  prefixRest: '\uB3C4 \uC90D\uACE0, ',
  suffixStrong: '\uD589\uBCF5',
  suffixRest: '\uB3C4 \uC90D\uAC8C \uB3C4\uC640\uB4DC\uB9B4\uAC8C\uC694.',
} as const;

export function SignUpCompleteScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { onboardingStatus, clearSignUpDraft } = useAuthStore();
  const rotation = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(1)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0.88)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;
  const rotationLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    rotationLoopRef.current = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    rotationLoopRef.current.start();

    timersRef.current.push(
      setTimeout(() => {
        rotationLoopRef.current?.stop();

        Animated.parallel([
          Animated.timing(loaderOpacity, {
            toValue: 0,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(checkOpacity, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(checkScale, {
            toValue: 1,
            damping: 12,
            stiffness: 160,
            mass: 0.9,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(80),
            Animated.parallel([
              Animated.timing(textOpacity, {
                toValue: 1,
                duration: 220,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(textTranslateY, {
                toValue: 0,
                duration: 220,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start();
      }, SPINNER_DURATION_MS),
    );

    timersRef.current.push(
      setTimeout(() => {
        clearSignUpDraft();

        if (!onboardingStatus) {
          router.replace('/login' as never);
          return;
        }

        router.replace(resolvePostAuthRoute(onboardingStatus) as never);
      }, SPINNER_DURATION_MS + COMPLETE_HOLD_DURATION_MS + 350),
    );

    return () => {
      rotationLoopRef.current?.stop();
      timersRef.current.forEach(clearTimeout);
    };
  }, [
    checkOpacity,
    checkScale,
    clearSignUpDraft,
    loaderOpacity,
    onboardingStatus,
    rotation,
    router,
    textOpacity,
    textTranslateY,
  ]);

  const contentTop = Math.max(300, Math.round(height * CONTENT_TOP_RATIO));
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={[styles.contentBlock, { top: contentTop }]}>
        <View style={styles.iconStage}>
          <Animated.Image
            resizeMode="contain"
            source={signupCompleteLoader}
            style={[
              styles.icon,
              {
                opacity: loaderOpacity,
                transform: [{ rotate: spin }],
              },
            ]}
          />
          <Animated.Image
            resizeMode="contain"
            source={signupCompleteCheck}
            style={[
              styles.icon,
              {
                opacity: checkOpacity,
                transform: [{ scale: checkScale }],
              },
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.textBlock,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>{COPY.title}</Text>
          <Text style={styles.subtitle}>
            <Text style={styles.subtitleStrong}>{COPY.prefixStrong}</Text>
            <Text style={styles.subtitleRegular}>{COPY.prefixRest}</Text>
            <Text style={styles.subtitleStrong}>{COPY.suffixStrong}</Text>
            <Text style={styles.subtitleRegular}>{COPY.suffixRest}</Text>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentBlock: {
    position: 'absolute',
    left: '50%',
    marginLeft: -116,
    width: 232,
    alignItems: 'center',
    gap: 36,
  },
  iconStage: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: colors.black,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
    letterSpacing: -0.48,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.gray400,
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
  },
  subtitleStrong: {
    color: colors.gray400,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
  },
  subtitleRegular: {
    color: colors.gray400,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 19,
  },
});
