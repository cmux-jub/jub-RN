import { useState } from 'react';
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

import { signUp } from '@/api/auth';
import { getAuthErrorMessage } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const FIGMA_SCREEN_HEIGHT = 852;
const NAV_TOP_RATIO = 44 / FIGMA_SCREEN_HEIGHT;
const HEADER_TOP_RATIO = 108 / FIGMA_SCREEN_HEIGHT;
const FORM_TOP_RATIO = 219 / FIGMA_SCREEN_HEIGHT;
const INDICATOR_BOTTOM_RATIO = 166 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 54 / FIGMA_SCREEN_HEIGHT;

const COPY = {
  navTitle: '\uD68C\uC6D0\uAC00\uC785',
  title: '\uC774\uB984',
  subtitleTop: '\uC0AC\uC6A9\uC790\uB2D8\uC758',
  subtitleBottom: '\uC774\uB984\uC744 \uC791\uC131\uD574\uC8FC\uC138\uC694',
  label: '\uC774\uB984',
  submit: '\uD68C\uC6D0\uAC00\uC785',
  hasAccount: '\uACC4\uC815\uC774 \uC788\uC73C\uC2E0\uAC00\uC694?',
  login: '\uB85C\uADF8\uC778',
  helper:
    '\uC6F9\uC5D0\uC11C\uB294 \uBE0C\uB77C\uC6B0\uC800 \uC815\uCC45(CORS)\uC73C\uB85C \uD68C\uC6D0\uAC00\uC785\uC774 \uC81C\uD55C\uB420 \uC218 \uC788\uC5B4\uC694. \uC571/\uC5D0\uBBAC\uB808\uC774\uD130\uC5D0\uC11C \uD14C\uC2A4\uD2B8\uD574\uC8FC\uC138\uC694.',
  missingDraft:
    '\uC774\uBA54\uC77C\uACFC \uBE44\uBC00\uBC88\uD638\uB97C \uBA3C\uC800 \uC785\uB825\uD574\uC8FC\uC138\uC694.',
} as const;

export function SignUpNameScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { signUpDraft, updateSignUpDraft, setSession } = useAuthStore();
  const [nickname, setNickname] = useState(signUpDraft.nickname);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedName = nickname.trim();
  const hasSubmitError = submitError !== null;
  const canSubmit = normalizedName.length > 0 && !isSubmitting;
  const navTop = Math.max(44, Math.round(height * NAV_TOP_RATIO));
  const headerTop = Math.max(108, Math.round(height * HEADER_TOP_RATIO));
  const formTop = Math.max(219, Math.round(height * FORM_TOP_RATIO));
  const indicatorBottom = Math.max(146, Math.round(height * INDICATOR_BOTTOM_RATIO));
  const ctaBottom = Math.max(36, Math.round(height * CTA_BOTTOM_RATIO));

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    if (!signUpDraft.email || !signUpDraft.password) {
      setSubmitError(COPY.missingDraft);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await signUp({
        email: signUpDraft.email,
        password: signUpDraft.password,
        nickname: normalizedName,
      });

      if (!response.success) {
        setSubmitError(response.error.message);
        return;
      }

      updateSignUpDraft({ nickname: normalizedName });
      setSession({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        onboardingStatus: response.data.onboarding_status,
      });

      router.push('/signup/complete' as never);
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/signup/password' as never);
  };

  const handleLogin = () => {
    router.replace('/login' as never);
  };

  const handleNicknameChange = (value: string) => {
    if (submitError) {
      setSubmitError(null);
    }

    setNickname(value);
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
          <Text style={styles.subtitle}>
            {COPY.subtitleTop}
            {'\n'}
            {COPY.subtitleBottom}
          </Text>
        </View>

        <View style={[styles.formBlock, { top: formTop }]}>
          <Text style={styles.fieldLabel}>{COPY.label}</Text>
          <TextInput
            autoCapitalize="words"
            onChangeText={handleNicknameChange}
            onSubmitEditing={() => {
              void handleSubmit();
            }}
            placeholder={COPY.label}
            placeholderTextColor={colors.gray400}
            returnKeyType="done"
            style={[styles.input, hasSubmitError && styles.inputError]}
            textContentType="name"
            value={nickname}
          />
          <Text style={styles.helperText}>{COPY.helper}</Text>
          {submitError ? <Text style={styles.statusMessage}>{submitError}</Text> : null}
        </View>

        <View style={[styles.indicatorRow, { bottom: indicatorBottom }]}>
          <View style={styles.inactiveIndicator} />
          <View style={styles.inactiveIndicator} />
          <View style={styles.activeIndicator} />
        </View>

        <View style={[styles.footerBlock, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
              pressed && canSubmit && styles.buttonPressed,
            ]}
          >
            <Text style={styles.submitButtonLabel}>{COPY.submit}</Text>
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
    right: 19,
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
  inputError: {
    borderColor: colors.red300,
  },
  helperText: {
    color: colors.gray500,
    fontSize: 12,
    lineHeight: 17,
  },
  statusMessage: {
    color: colors.red300,
    fontSize: 13,
    lineHeight: 18,
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
  submitButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  submitButtonLabel: {
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
