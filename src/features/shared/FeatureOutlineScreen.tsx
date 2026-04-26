import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/components/layout/AppScreen';
import { BulletList } from '@/components/ui/BulletList';
import { SectionCard } from '@/components/ui/SectionCard';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type FeatureOutlineScreenProps = {
  eyebrow: string;
  title: string;
  summary: string;
  sourceFiles: string[];
  apiContracts: string[];
  screenStates: string[];
  notes: string[];
};

export function FeatureOutlineScreen({
  eyebrow,
  title,
  summary,
  sourceFiles,
  apiContracts,
  screenStates,
  notes,
}: FeatureOutlineScreenProps) {
  return (
    <AppScreen>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>

      <SectionCard title="Source files">
        <BulletList items={sourceFiles} />
      </SectionCard>

      <SectionCard title="API contracts">
        <BulletList items={apiContracts} />
      </SectionCard>

      <SectionCard title="Screen states">
        <BulletList items={screenStates} />
      </SectionCard>

      <SectionCard title="Implementation notes">
        <BulletList items={notes} />
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
    marginBottom: spacing.xs,
  },
});
