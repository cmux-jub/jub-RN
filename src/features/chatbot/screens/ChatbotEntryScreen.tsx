import { FeatureOutlineScreen } from '@/features/shared/FeatureOutlineScreen';

export function ChatbotEntryScreen() {
  return (
    <FeatureOutlineScreen
      eyebrow="Chatbot"
      title="Pre-purchase entry"
      summary="Collect the initial free-text concern, optional amount hint, and optional product hint before starting a session."
      sourceFiles={[
        'src/app/chatbot/index.tsx',
        'src/features/chatbot/screens/ChatbotEntryScreen.tsx',
        'src/store/chatbotSessionStore.ts',
      ]}
      apiContracts={[
        'POST /chatbot/sessions',
        'GET /subscription',
      ]}
      screenStates={[
        'ready to start',
        'quota limited',
        'labeling required',
        'session creation failure',
      ]}
      notes={[
        'The user must still be the decision-maker.',
        'This route is one of the two allowed input channels in the MVP.',
      ]}
    />
  );
}
