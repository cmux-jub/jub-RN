import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function RetrospectiveHistoryScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Retrospective"
      title="Review history"
      summary="Cursor-based history of completed retrospectives and weekly insight headlines."
      sourceFiles={[
        'src/app/retrospective/history.tsx',
        'src/features/retrospective/screens/RetrospectiveHistoryScreen.tsx',
        'src/api/retrospectives.ts',
      ]}
      apiContracts={[
        'GET /retrospectives',
      ]}
      screenStates={[
        'history list',
        'empty history',
        'cursor pagination',
      ]}
      notes={[
        'Weekly insight text is server-generated; RN only presents it.',
      ]}
    />
  );
}
