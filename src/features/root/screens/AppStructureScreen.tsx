import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { UsageLimitBanner } from '@/components/banners/UsageLimitBanner';
import { RouteLinkCard } from '@/components/ui/RouteLinkCard';
import { SectionCard } from '@/components/ui/SectionCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export function AppStructureScreen() {
  return (
    <AppScreen>
      <Text style={styles.eyebrow}>jub RN structure</Text>
      <Text style={styles.title}>Feature-based scaffold for the APK demo app</Text>
      <Text style={styles.summary}>
        This repo is structured around the product flows defined in the markdown docs:
        onboarding, pre-purchase chatbot, weekly retrospective, insights, and subscription.
      </Text>

      <UsageLimitBanner remainingFullSessions={5} />

      <SectionCard title="Route map">
        <View style={styles.routeGroup}>
          <RouteLinkCard
            href="/onboarding"
            title="Onboarding"
            subtitle="Bank connect, labeling queue, first insight."
            file="src/app/onboarding/*"
          />
          <RouteLinkCard
            href="/chatbot"
            title="Chatbot"
            subtitle="Session start, live conversation, summary, and history."
            file="src/app/chatbot/*"
          />
          <RouteLinkCard
            href="/retrospective"
            title="Retrospective"
            subtitle="Current-week review flow and history."
            file="src/app/retrospective/*"
          />
          <RouteLinkCard
            href="/insights"
            title="Insights"
            subtitle="Archive, saved amount, and dashboard surfaces."
            file="src/app/insights/*"
          />
          <RouteLinkCard
            href="/subscription"
            title="Subscription"
            subtitle="Quota status and upgrade surface."
            file="src/app/subscription/*"
          />
        </View>
      </SectionCard>

      <SectionCard title="Source layout">
        <Text style={styles.code}>src/app</Text>
        <Text style={styles.body}>Expo Router files only. Each route re-exports a screen from features.</Text>
        <Text style={styles.code}>src/features</Text>
        <Text style={styles.body}>Screen scaffolds and future feature-local components/hooks.</Text>
        <Text style={styles.code}>src/api</Text>
        <Text style={styles.body}>Typed contracts and API wrappers based on API_SPEC.md.</Text>
        <Text style={styles.code}>src/store</Text>
        <Text style={styles.body}>Zustand stores for session-level UI state.</Text>
        <Text style={styles.code}>src/services</Text>
        <Text style={styles.body}>Tracking, websocket, and notification wrappers.</Text>
        <Text style={styles.code}>src/components</Text>
        <Text style={styles.body}>Reusable layout, state, and structural UI components.</Text>
      </SectionCard>

      <SectionCard title="Current baseline">
        <Text style={styles.body}>
          This project is explicitly positioned as an APK demo build, not a Google Play
          Store production submission target.
        </Text>
        <Link href="/onboarding" style={styles.link}>
          Start with onboarding routes
        </Link>
      </SectionCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.gray500,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.gray900,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  summary: {
    color: colors.gray700,
    fontSize: 15,
    lineHeight: 23,
  },
  routeGroup: {
    gap: spacing.sm,
  },
  code: {
    color: colors.gray900,
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    color: colors.gray700,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  link: {
    color: colors.gray800,
    fontSize: 15,
    fontWeight: '700',
  },
});
