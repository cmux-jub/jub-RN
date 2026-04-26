import { useLocalSearchParams } from 'expo-router';

import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function ChatbotSummaryScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <FeatureOutlineScreen
      eyebrow="Chatbot"
      title={`Session summary ${sessionId ?? '[sessionId]'}`}
      summary="Dedicated summary view that restates product, user reasoning, AI comparison basis, and final decision."
      sourceFiles={[
        'src/app/chatbot/summary/[sessionId].tsx',
        'src/features/chatbot/screens/ChatbotSummaryScreen.tsx',
        'src/api/chatbot.ts',
      ]}
      apiContracts={[
        'GET /chatbot/sessions/{session_id}',
      ]}
      screenStates={[
        'summary available immediately',
        'summary polling / retry',
        'summary missing after close',
      ]}
      notes={[
        'The summary should remain grounded in data, not dramatic persuasion.',
      ]}
    />
  );
}
