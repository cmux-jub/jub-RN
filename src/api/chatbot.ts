import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse, Decision } from '@/api/types/common';
import type { ChatbotSessionDetail, ChatbotSessionListResponseData, DecideSessionResponseData, StartChatbotSessionRequest, StartChatbotSessionResponseData } from '@/api/types/chatbot';

export async function startChatbotSession(payload: StartChatbotSessionRequest) {
  const { data } = await apiClient.post<ApiResponse<StartChatbotSessionResponseData>>(endpoints.chatbot.sessions, payload);
  return data;
}

export async function fetchChatbotSessions() {
  const { data } = await apiClient.get<ApiResponse<ChatbotSessionListResponseData>>(endpoints.chatbot.sessions);
  return data;
}

export async function fetchChatbotSessionDetail(sessionId: string) {
  const { data } = await apiClient.get<ApiResponse<ChatbotSessionDetail>>(`${endpoints.chatbot.sessions}/${sessionId}`);
  return data;
}

export async function decideChatbotSession(sessionId: string, decision: Decision) {
  const { data } = await apiClient.post<ApiResponse<DecideSessionResponseData>>(
    `${endpoints.chatbot.sessions}/${sessionId}/decide`,
    { decision },
  );
  return data;
}
