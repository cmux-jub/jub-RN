const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const configuredApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim()?.replace(/\/+$/, '') || DEFAULT_API_BASE_URL;

export const apiBaseUrl = configuredApiBaseUrl.endsWith('/v1')
  ? configuredApiBaseUrl
  : `${configuredApiBaseUrl}/v1`;

const websocketRootUrl = `${apiBaseUrl.replace(/^http/i, 'ws')}/ws`;

export const chatbotWebSocketBaseUrl = `${websocketRootUrl}/chatbot`;

export function buildChatbotWebSocketUrl(sessionId: string) {
  return `${chatbotWebSocketBaseUrl}/${sessionId}`;
}

export function normalizeChatbotWebSocketUrl(websocketUrl: string) {
  const matchedSessionId = websocketUrl.match(/\/chatbot\/([^/?]+)/)?.[1];

  if (!matchedSessionId) {
    return websocketUrl;
  }

  return buildChatbotWebSocketUrl(matchedSessionId);
}
