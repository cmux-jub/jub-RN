import { buildChatbotWebSocketUrl, normalizeChatbotWebSocketUrl } from '@/api/baseUrl';
import type { Decision } from '@/api/types/common';
import type { ChatbotServerSocketEvent } from '@/api/types/chatbot';

type ChatbotSocketConfig = {
  accessToken: string;
  sessionId?: string;
  websocketUrl?: string;
  onMessage?: (event: ChatbotServerSocketEvent) => void;
};

function resolveSocketUrl({ sessionId, websocketUrl }: Pick<ChatbotSocketConfig, 'sessionId' | 'websocketUrl'>) {
  if (sessionId) {
    return buildChatbotWebSocketUrl(sessionId);
  }

  if (websocketUrl) {
    return normalizeChatbotWebSocketUrl(websocketUrl);
  }

  throw new Error('createChatbotSocket requires either sessionId or websocketUrl.');
}

export function createChatbotSocket({
  accessToken,
  sessionId,
  websocketUrl,
  onMessage,
}: ChatbotSocketConfig) {
  const resolvedSocketUrl = resolveSocketUrl({ sessionId, websocketUrl });
  const authSeparator = resolvedSocketUrl.includes('?') ? '&' : '?';
  const socket = new WebSocket(`${resolvedSocketUrl}${authSeparator}token=${accessToken}`);

  socket.onmessage = (event) => {
    if (!onMessage) {
      return;
    }

    onMessage(JSON.parse(event.data) as ChatbotServerSocketEvent);
  };

  return socket;
}

export function sendChatbotMessage(socket: WebSocket, content: string) {
  socket.send(
    JSON.stringify({
      type: 'user_message',
      content,
    }),
  );
}

export function sendChatbotDecision(socket: WebSocket, decision: Decision) {
  socket.send(
    JSON.stringify({
      type: 'decision',
      decision,
    }),
  );
}
