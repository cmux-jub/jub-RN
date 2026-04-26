import type { PropsWithChildren, ReactNode } from 'react';

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

const splashLogo = require('../../../../assets/images/joob-splash-logo.png');

const FIGMA_SCREEN_HEIGHT = 852;
const LOGO_TOP_RATIO = 68 / FIGMA_SCREEN_HEIGHT;
const CONTENT_TOP_RATIO = 184 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 36 / FIGMA_SCREEN_HEIGHT;

type AuthStepLayoutProps = PropsWithChildren<{
  stepLabel: string;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  secondaryAction?: ReactNode;
}>;

export function AuthStepLayout({
  stepLabel,
  title,
  description,
  primaryLabel,
  onPrimaryPress,
  primaryDisabled = false,
  secondaryAction,
  children,
}: AuthStepLayoutProps) {
  const { height } = useWindowDimensions();

  const logoTop = Math.max(44, Math.round(height * LOGO_TOP_RATIO));
  const contentTop = Math.max(160, Math.round(height * CONTENT_TOP_RATIO));
  const ctaBottom = Math.max(24, Math.round(height * CTA_BOTTOM_RATIO));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View pointerEvents="none" style={[styles.logoContainer, { top: logoTop }]}>
          <Image
            accessibilityIgnoresInvertColors
            accessible={false}
            resizeMode="contain"
            source={splashLogo}
            style={styles.logo}
          />
        </View>

        <View style={[styles.contentContainer, { top: contentTop }]}>
          <Text style={styles.stepLabel}>{stepLabel}</Text>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.fieldContainer}>{children}</View>
        </View>

        <View style={[styles.footerContainer, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            disabled={primaryDisabled}
            onPress={onPrimaryPress}
            style={({ pressed }) => [
              styles.primaryButton,
              primaryDisabled && styles.primaryButtonDisabled,
              pressed && !primaryDisabled && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>{primaryLabel}</Text>
          </Pressable>
          {secondaryAction ? <View style={styles.secondaryAction}>{secondaryAction}</View> : null}
        </View>
      </KeyboardAvoidingView>
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
  contentContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 10,
  },
  stepLabel: {
    color: colors.gray500,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  description: {
    color: colors.gray700,
    fontSize: 15,
    lineHeight: 22,
  },
  fieldContainer: {
    marginTop: 12,
    gap: 12,
  },
  footerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 16,
  },
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  primaryButtonPressed: {
    opacity: 0.84,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  secondaryAction: {
    alignItems: 'center',
  },
});
