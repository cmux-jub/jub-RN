import { create } from 'zustand';

import type { Decision } from '@/api/types/common';

type ChatbotSessionState = {
  draftMessage: string;
  activeSessionId: string | null;
  pendingDecision: Decision | null;
  setDraftMessage: (message: string) => void;
  startSession: (sessionId: string) => void;
  setPendingDecision: (decision: Decision | null) => void;
  clearSession: () => void;
};

export const useChatbotSessionStore = create<ChatbotSessionState>((set) => ({
  draftMessage: '',
  activeSessionId: null,
  pendingDecision: null,
  setDraftMessage: (draftMessage) => set({ draftMessage }),
  startSession: (activeSessionId) => set({ activeSessionId }),
  setPendingDecision: (pendingDecision) => set({ pendingDecision }),
  clearSession: () =>
    set({
      draftMessage: '',
      activeSessionId: null,
      pendingDecision: null,
    }),
}));
