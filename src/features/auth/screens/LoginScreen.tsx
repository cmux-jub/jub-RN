import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Image,
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

import { login } from '@/api/auth';
import { getAuthErrorMessage, resolvePostAuthRoute } from '@/features/auth/utils/authFlow';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme/colors';

const loginHeroOrb = require('../../../../assets/images/login-hero-orb.png');

const FIGMA_SCREEN_HEIGHT = 852;
const HERO_TOP_RATIO = 33 / FIGMA_SCREEN_HEIGHT;
const HEADER_TOP_RATIO = 108 / FIGMA_SCREEN_HEIGHT;
const FORM_TOP_RATIO = 224 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 54 / FIGMA_SCREEN_HEIGHT;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  title: '\uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC\uC694.',
  subtitleTop: '\uB85C\uADF8\uC778\uD558\uACE0 \uB098\uB9CC\uC758',
  subtitleBottom: '\uD589\uBCF5\uC744 \uD6A8\uC728\uC801\uC73C\uB85C \uAD00\uB9AC\uD574\uBCF4\uC138\uC694!',
  email: '\uC774\uBA54\uC77C',
  password: '\uBE44\uBC00\uBC88\uD638',
  forgotPassword: '\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30',
  login: '\uB85C\uADF8\uC778',
  noAccount: '\uACC4\uC815\uC774 \uC5C6\uC73C\uC2E0\uAC00\uC694?',
  signUp: '\uD68C\uC6D0\uAC00\uC785',
} as const;

export function LoginScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const setSession = useAuthStore((state) => state.setSession);
  const passwordInputRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedEmail = email.trim();
  const hasSubmitError = submitError !== null;
  const canSubmit = useMemo(
    () => EMAIL_PATTERN.test(normalizedEmail) && password.length > 0 && !isSubmitting,
    [normalizedEmail, password, isSubmitting],
  );

  const heroTop = Math.max(20, Math.round(height * HERO_TOP_RATIO));
  const headerTop = Math.max(96, Math.round(height * HEADER_TOP_RATIO));
  const formTop = Math.max(212, Math.round(height * FORM_TOP_RATIO));
  const ctaBottom = Math.max(36, Math.round(height * CTA_BOTTOM_RATIO));

  const handleLogin = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await login({
        email: normalizedEmail,
        password,
      });

      if (!response.success) {
        setSubmitError(response.error.message);
        return;
      }

      setSession({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        onboardingStatus: response.data.onboarding_status,
      });

      router.replace(resolvePostAuthRoute(response.data.onboarding_status) as never);
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup/email' as never);
  };

  const handleEmailChange = (value: string) => {
    if (submitError) {
      setSubmitError(null);
    }

    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    if (submitError) {
      setSubmitError(null);
    }

    setPassword(value);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <Image
          accessibilityIgnoresInvertColors
          accessible={false}
          resizeMode="contain"
          source={loginHeroOrb}
          style={[styles.heroOrb, { top: heroTop }]}
        />

        <View style={[styles.headerBlock, { top: headerTop }]}>
          <Text style={styles.title}>{COPY.title}</Text>
          <Text style={styles.subtitle}>
            {COPY.subtitleTop}
            {'\n'}
            {COPY.subtitleBottom}
          </Text>
        </View>

        <View style={[styles.formBlock, { top: formTop }]}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{COPY.email}</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={handleEmailChange}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              placeholder={COPY.email}
              placeholderTextColor={colors.gray400}
              returnKeyType="next"
              style={[styles.input, hasSubmitError && styles.inputError]}
              textContentType="emailAddress"
              value={email}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{COPY.password}</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={handlePasswordChange}
              onSubmitEditing={() => {
                void handleLogin();
              }}
              placeholder={COPY.password}
              placeholderTextColor={colors.gray400}
              ref={passwordInputRef}
              returnKeyType="done"
              secureTextEntry
              style={[styles.input, hasSubmitError && styles.inputError]}
              textContentType="password"
              value={password}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {}}
            style={({ pressed }) => [styles.forgotPasswordWrap, pressed && styles.linkPressed]}
          >
            <Text style={styles.forgotPassword}>{COPY.forgotPassword}</Text>
          </Pressable>

          {submitError ? <Text style={styles.statusMessage}>{submitError}</Text> : null}
        </View>

        <View style={[styles.footerBlock, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            disabled={!canSubmit}
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              !canSubmit && styles.loginButtonDisabled,
              pressed && canSubmit && styles.buttonPressed,
            ]}
          >
            <Text style={styles.loginButtonLabel}>{COPY.login}</Text>
          </Pressable>

          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>{COPY.noAccount}</Text>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleSignUp}
              style={({ pressed }) => pressed && styles.linkPressed}
            >
              <Text style={styles.signUpLink}>{COPY.signUp}</Text>
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
  heroOrb: {
    position: 'absolute',
    right: 0,
    width: 150,
    height: 300,
  },
  headerBlock: {
    position: 'absolute',
    left: 20,
    width: 220,
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
    gap: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.gray900,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
  },
  input: {
    height: 56,
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
  forgotPasswordWrap: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  forgotPassword: {
    color: colors.gray500,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  statusMessage: {
    color: colors.red300,
    fontSize: 13,
    lineHeight: 18,
  },
  footerBlock: {
    position: 'absolute',
    left: 20,
    right: 20,
    gap: 20,
  },
  loginButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  loginButtonLabel: {
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
  buttonPressed: {
    opacity: 0.84,
  },
  linkPressed: {
    opacity: 0.72,
  },
});
