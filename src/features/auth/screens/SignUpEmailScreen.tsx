import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIGMA_SCREEN_HEIGHT = 852;
const NAV_TOP_RATIO = 44 / FIGMA_SCREEN_HEIGHT;
const HEADER_TOP_RATIO = 108 / FIGMA_SCREEN_HEIGHT;
const FORM_TOP_RATIO = 219 / FIGMA_SCREEN_HEIGHT;
const INDICATOR_BOTTOM_RATIO = 182 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 54 / FIGMA_SCREEN_HEIGHT;

const COPY = {
  navTitle: '\uD68C\uC6D0\uAC00\uC785',
  title: '\uC774\uBA54\uC77C',
  subtitle: '\uC0AC\uC6A9\uC790\uB2D8\uC758 \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694.',
  label: '\uC774\uBA54\uC77C',
  next: '\uB2E4\uC74C',
  hasAccount: '\uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?',
  login: '\uB85C\uADF8\uC778',
} as const;

export function SignUpEmailScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { signUpDraft, updateSignUpDraft } = useAuthStore();
  const [email, setEmail] = useState(signUpDraft.email);

  const normalizedEmail = email.trim();
  const isValidEmail = useMemo(() => EMAIL_PATTERN.test(normalizedEmail), [normalizedEmail]);

  const navTop = Math.max(44, Math.round(height * NAV_TOP_RATIO));
  const headerTop = Math.max(108, Math.round(height * HEADER_TOP_RATIO));
  const formTop = Math.max(219, Math.round(height * FORM_TOP_RATIO));
  const indicatorBottom = Math.max(140, Math.round(height * INDICATOR_BOTTOM_RATIO));
  const ctaBottom = Math.max(36, Math.round(height * CTA_BOTTOM_RATIO));

  const handleNext = () => {
    if (!isValidEmail) {
      return;
    }

    updateSignUpDraft({ email: normalizedEmail });
    router.push('/signup/password' as never);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/login' as never);
  };

  const handleLogin = () => {
    router.replace('/login' as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View style={[styles.navBar, { top: navTop }]}>
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.linkPressed]}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <Text style={styles.navTitle}>{COPY.navTitle}</Text>
        </View>

        <View style={[styles.headerBlock, { top: headerTop }]}>
          <Text style={styles.title}>{COPY.title}</Text>
          <Text style={styles.subtitle}>{COPY.subtitle}</Text>
        </View>

        <View style={[styles.formBlock, { top: formTop }]}>
          <Text style={styles.fieldLabel}>{COPY.label}</Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            onSubmitEditing={handleNext}
            placeholder={COPY.label}
            placeholderTextColor={colors.gray400}
            returnKeyType="done"
            style={styles.input}
            textContentType="emailAddress"
            value={email}
          />
        </View>

        <View style={[styles.indicatorRow, { bottom: indicatorBottom }]}>
          <View style={styles.activeIndicator} />
          <View style={styles.inactiveIndicator} />
          <View style={styles.inactiveIndicator} />
        </View>

        <View style={[styles.footerBlock, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.nextButtonLabel}>{COPY.next}</Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>{COPY.hasAccount}</Text>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleLogin}
              style={({ pressed }) => pressed && styles.linkPressed}
            >
              <Text style={styles.loginLink}>{COPY.login}</Text>
            </Pressable>
          </View>
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
  navBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 24,
    height: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 1,
  },
  backIcon: {
    color: colors.gray500,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 28,
  },
  navTitle: {
    textAlign: 'center',
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
  headerBlock: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 8,
  },
  title: {
    color: colors.black,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.gray500,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  },
  formBlock: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 6,
  },
  fieldLabel: {
    color: colors.gray900,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
  input: {
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray50,
    backgroundColor: colors.gray50,
    paddingHorizontal: 20,
    color: colors.gray900,
    fontSize: 16,
    fontWeight: '400',
  },
  indicatorRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  activeIndicator: {
    width: 11,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mint500,
  },
  inactiveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.gray200,
  },
  footerBlock: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 20,
  },
  nextButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  nextButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loginPrompt: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  loginLink: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  buttonPressed: {
    opacity: 0.84,
  },
  linkPressed: {
    opacity: 0.72,
  },
});
