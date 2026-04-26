import type { Decision } from '@/api/types/common';
import type { ChatbotServerSocketEvent } from '@/api/types/chatbot';

type ChatbotSocketConfig = {
  websocketUrl: string;
  accessToken: string;
  onMessage?: (event: ChatbotServerSocketEvent) => void;
};

export function createChatbotSocket({ websocketUrl, accessToken, onMessage }: ChatbotSocketConfig) {
  const socket = new WebSocket(`${websocketUrl}?token=${accessToken}`);

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
