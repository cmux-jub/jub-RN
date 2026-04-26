import { useLocalSearchParams } from 'expo-router';

import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function ChatbotSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <FeatureOutlineScreen
      eyebrow="Chatbot"
      title={`Live session ${sessionId ?? '[sessionId]'}`}
      summary="Streaming assistant tokens, user follow-up messages, and the final BUY / RECONSIDER / SKIP choice all converge here."
      sourceFiles={[
        'src/app/chatbot/[sessionId].tsx',
        'src/features/chatbot/screens/ChatbotSessionScreen.tsx',
        'src/services/chatbot/socket.ts',
      ]}
      apiContracts={[
        'WS /ws/chatbot/{session_id}',
        'POST /chatbot/sessions/{session_id}/decide',
      ]}
      screenStates={[
        'assistant streaming',
        'assistant done',
        'rate limit or ws error',
        'decision submitted',
      ]}
      notes={[
        'WebSocket event names must stay aligned with API_SPEC.md.',
        'RN renders server data and user input flow; recommendation logic stays on the backend.',
      ]}
    />
  );
}
