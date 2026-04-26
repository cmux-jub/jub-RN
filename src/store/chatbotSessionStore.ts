import { create } from 'zustand';

import type { Decision } from '@/api/types/common';
import type { ChatbotSessionSummary } from '@/api/types/chatbot';

type ChatbotSessionState = {
  draftMessage: string;
  activeSessionId: string | null;
  activeWebsocketUrl: string | null;
  pendingDecision: Decision | null;
  resolvedSummarySessionId: string | null;
  resolvedSummary: ChatbotSessionSummary | null;
  setDraftMessage: (message: string) => void;
  startSession: (sessionId: string, websocketUrl?: string | null) => void;
  setPendingDecision: (decision: Decision | null) => void;
  setResolvedSummary: (sessionId: string, summary: ChatbotSessionSummary | null) => void;
  clearSession: () => void;
};

export const useChatbotSessionStore = create<ChatbotSessionState>((set) => ({
  draftMessage: '',
  activeSessionId: null,
  activeWebsocketUrl: null,
  pendingDecision: null,
  resolvedSummarySessionId: null,
  resolvedSummary: null,
  setDraftMessage: (draftMessage) => set({ draftMessage }),
  startSession: (activeSessionId, activeWebsocketUrl = null) =>
    set({
      activeSessionId,
      activeWebsocketUrl,
      pendingDecision: null,
      resolvedSummarySessionId: null,
      resolvedSummary: null,
    }),
  setPendingDecision: (pendingDecision) => set({ pendingDecision }),
  setResolvedSummary: (resolvedSummarySessionId, resolvedSummary) =>
    set({ resolvedSummarySessionId, resolvedSummary }),
  clearSession: () =>
    set({
      draftMessage: '',
      activeSessionId: null,
      activeWebsocketUrl: null,
      pendingDecision: null,
      resolvedSummarySessionId: null,
      resolvedSummary: null,
    }),
}));
