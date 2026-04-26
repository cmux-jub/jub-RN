import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function HappyArchiveScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Insights"
      title="Happy purchase archive"
      summary="High-satisfaction purchases shown as pattern-based cards, not as a raw transaction dump."
      sourceFiles={[
        'src/app/insights/archive.tsx',
        'src/features/insights/screens/HappyArchiveScreen.tsx',
        'src/services/tracking/events.ts',
      ]}
      apiContracts={[
        'GET /insights/happy-purchases',
      ]}
      screenStates={[
        'archive populated',
        'archive empty',
        'load more with cursor',
      ]}
      notes={[
        'Archive should help the user quickly recall where spending creates happiness.',
      ]}
    />
  );
}
