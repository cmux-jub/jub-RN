import { useState } from 'react';
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

import { colors } from '@/theme/colors';

const loginHeroOrb = require('../../../../assets/images/login-hero-orb.png');

const FIGMA_SCREEN_HEIGHT = 852;
const HERO_TOP_RATIO = 33 / FIGMA_SCREEN_HEIGHT;
const HEADER_TOP_RATIO = 108 / FIGMA_SCREEN_HEIGHT;
const FORM_TOP_RATIO = 224 / FIGMA_SCREEN_HEIGHT;
const CTA_BOTTOM_RATIO = 54 / FIGMA_SCREEN_HEIGHT;

const COPY = {
  title: '\uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC\uC694.',
  subtitleTop: '\uB85C\uADF8\uC778\uD558\uC5EC \uB3C8 \uAD00\uB9AC\uC640',
  subtitleBottom: '\uD589\uBCF5\uC744 \uD6A8\uC728\uC801\uC73C\uB85C \uAD00\uB9AC\uD574\uBD10\uC694!',
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const heroTop = Math.max(20, Math.round(height * HERO_TOP_RATIO));
  const headerTop = Math.max(96, Math.round(height * HEADER_TOP_RATIO));
  const formTop = Math.max(212, Math.round(height * FORM_TOP_RATIO));
  const ctaBottom = Math.max(36, Math.round(height * CTA_BOTTOM_RATIO));

  const handleLogin = () => {
    router.replace('/onboarding/connect-bank' as never);
  };

  const handleSignUp = () => {
    router.push('/signup/email' as never);
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
          pointerEvents="none"
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
              onChangeText={setEmail}
              placeholder={COPY.email}
              placeholderTextColor={colors.gray400}
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{COPY.password}</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setPassword}
              placeholder={COPY.password}
              placeholderTextColor={colors.gray400}
              secureTextEntry
              style={styles.input}
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
        </View>

        <View style={[styles.footerBlock, { bottom: ctaBottom }]}>
          <Pressable
            accessibilityRole="button"
            onPress={handleLogin}
            style={({ pressed }) => [styles.loginButton, pressed && styles.buttonPressed]}
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
