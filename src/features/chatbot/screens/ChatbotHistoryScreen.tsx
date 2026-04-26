import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function ChatbotHistoryScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Chatbot"
      title="Session history"
      summary="List past chatbot sessions so users can revisit summaries and linked transactions."
      sourceFiles={[
        'src/app/chatbot/history.tsx',
        'src/features/chatbot/screens/ChatbotHistoryScreen.tsx',
        'src/api/chatbot.ts',
      ]}
      apiContracts={[
        'GET /chatbot/sessions',
        'GET /chatbot/sessions/{session_id}',
      ]}
      screenStates={[
        'history populated',
        'history empty',
        'loading more with cursor',
      ]}
      notes={[
        'History is read-only in RN; server owns summary generation.',
      ]}
    />
  );
}
