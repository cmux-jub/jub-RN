import { create } from 'zustand';

import type { Decision } from '@/api/types/common';

type ChatbotSessionState = {
  draftMessage: string;
  activeSessionId: string | null;
  activeWebsocketUrl: string | null;
  pendingDecision: Decision | null;
  setDraftMessage: (message: string) => void;
  startSession: (sessionId: string, websocketUrl?: string | null) => void;
  setPendingDecision: (decision: Decision | null) => void;
  clearSession: () => void;
};

export const useChatbotSessionStore = create<ChatbotSessionState>((set) => ({
  draftMessage: '',
  activeSessionId: null,
  activeWebsocketUrl: null,
  pendingDecision: null,
  setDraftMessage: (draftMessage) => set({ draftMessage }),
  startSession: (activeSessionId, activeWebsocketUrl = null) =>
    set({ activeSessionId, activeWebsocketUrl }),
  setPendingDecision: (pendingDecision) => set({ pendingDecision }),
  clearSession: () =>
    set({
      draftMessage: '',
      activeSessionId: null,
      activeWebsocketUrl: null,
      pendingDecision: null,
    }),
}));
