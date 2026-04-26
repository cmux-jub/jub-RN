import { isAxiosError } from 'axios';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { startChatbotSession } from '@/api/chatbot';
import type { ApiFailureResponse } from '@/api/types/common';
import type {
  ChatbotMessage,
  ChatbotServerSocketEvent,
  StartChatbotSessionRequest,
} from '@/api/types/chatbot';
import { createChatbotSocket, sendChatbotMessage } from '@/services/chatbot/socket';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useAuthStore } from '@/store/authStore';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors, spacing } from '@/theme';

const PREVIEW_SESSION_ID = 'demo-session';
const EMPTY_PREVIEW_PROMPT = '30만원 중고\n에어팟을 구매할까?';
const WAITING_ASSISTANT_MESSAGE = '답변을 불러오는 중이에요.';
const COMPOSER_CORNER_RADIUS = 24;
const CHAT_BUBBLE_RADIUS = 12;
const HERO_MARK_SIZE = 100;
const AVATAR_MARK_SIZE = 30;
const WATERMARK_MARK_SIZE = 120;

type ValidationErrorResponse = {
  detail?: {
    msg?: string;
  }[];
};

function ChevronLeftIcon() {
  return (
    <View style={styles.chevronIcon} pointerEvents="none">
      <View style={[styles.chevronStroke, styles.chevronStrokeTop]} />
      <View style={[styles.chevronStroke, styles.chevronStrokeBottom]} />
    </View>
  );
}

function SendIcon() {
  return (
    <View style={styles.sendIcon} pointerEvents="none">
      <View style={styles.sendIconBody} />
      <View style={styles.sendIconWingTop} />
      <View style={styles.sendIconWingBottom} />
    </View>
  );
}

function BrandMark({
  backgroundColor,
  faded = false,
  size,
}: {
  backgroundColor: string;
  faded?: boolean;
  size: number;
}) {
  const circleSize = Math.round(size * 0.6);
  const borderWidth = Math.max(4, Math.round(size * 0.13));
  const gapWidth = Math.round(size * 0.5);
  const gapHeight = Math.round(size * 0.34);
  const gapBottom = Math.max(2, Math.round(size * 0.06));
  const capSize = Math.max(5, Math.round(size * 0.16));
  const capBottom = Math.max(4, Math.round(size * 0.14));
  const capInset = Math.max(6, Math.round(size * 0.18));

  return (
    <View
      pointerEvents="none"
      style={[
        styles.brandMark,
        {
          width: size,
          height: size,
          opacity: faded ? 0.12 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.brandMarkCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth,
          },
        ]}
      />
      <View
        style={[
          styles.brandMarkGap,
          {
            width: gapWidth,
            height: gapHeight,
            bottom: gapBottom,
            backgroundColor,
          },
        ]}
      />
      <View
        style={[
          styles.brandMarkCap,
          {
            width: capSize,
            height: capSize,
            borderRadius: capSize / 2,
            bottom: capBottom,
            left: capInset,
          },
        ]}
      />
      <View
        style={[
          styles.brandMarkCap,
          styles.brandMarkCapSoft,
          {
            width: capSize,
            height: capSize,
            borderRadius: capSize / 2,
            bottom: capBottom,
            right: capInset,
          },
        ]}
      />
    </View>
  );
}

function EmptyHero({ prompt }: { prompt: string }) {
  return (
    <View style={styles.emptyHero}>
      <BrandMark backgroundColor={colors.gray100} size={HERO_MARK_SIZE} />
      <View style={styles.emptyHeroTextWrap}>
        <Text style={styles.emptyHeroText}>{prompt}</Text>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatbotMessage }) {
  if (message.role === 'user') {
    return (
      <View style={styles.userMessageRow}>
        <View style={styles.userMessageBubble}>
          <Text style={styles.chatMessageText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantMessageRow}>
      <BrandMark backgroundColor={colors.gray100} size={AVATAR_MARK_SIZE} />
      <View style={styles.assistantMessageBubble}>
        <Text style={styles.chatMessageText}>{message.content}</Text>
      </View>
    </View>
  );
}

function FeedbackPrompt({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.feedbackPrompt}>
      <BrandMark backgroundColor={colors.white} size={24} />
      <Text numberOfLines={1} style={styles.feedbackPromptText}>
        대화가 만족스러우셨나요? 만족할 시 <Text style={styles.feedbackPromptLink}>클릭</Text>
      </Text>
    </Pressable>
  );
}

function Watermark() {
  return (
    <View pointerEvents="none" style={styles.watermarkWrap}>
      <BrandMark backgroundColor={colors.gray100} faded size={WATERMARK_MARK_SIZE} />
    </View>
  );
}

function createMessage(role: ChatbotMessage['role'], content: string): ChatbotMessage {
  return {
    role,
    content,
    created_at: new Date().toISOString(),
  };
}

function buildStartSessionPayload(initialMessage: string): StartChatbotSessionRequest {
  const amountHint = extractAmountHint(initialMessage);

  return {
    initial_message: initialMessage,
    ...(typeof amountHint === 'number' ? { amount_hint: amountHint } : {}),
  };
}

function extractAmountHint(message: string) {
  const normalizedMessage = message.replace(/\s+/g, ' ');
  const tenThousandMatch = normalizedMessage.match(/(\d[\d,]*)\s*만\s*원?/);

  if (tenThousandMatch) {
    return Number(tenThousandMatch[1].replace(/,/g, '')) * 10_000;
  }

  const thousandMatch = normalizedMessage.match(/(\d[\d,]*)\s*천\s*원?/);

  if (thousandMatch) {
    return Number(thousandMatch[1].replace(/,/g, '')) * 1_000;
  }

  const wonMatch = normalizedMessage.match(/(\d[\d,]*)\s*원/);

  if (wonMatch) {
    return Number(wonMatch[1].replace(/,/g, ''));
  }

  return undefined;
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (isAxiosError<ApiFailureResponse | ValidationErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (responseData && 'error' in responseData && responseData.error?.message) {
      return responseData.error.message;
    }

    if (
      responseData &&
      'detail' in responseData &&
      Array.isArray(responseData.detail) &&
      responseData.detail[0]?.msg
    ) {
      return responseData.detail[0].msg;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function ChatbotSessionScreen() {
  const { sessionId: routeSessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const connectedSessionIdRef = useRef<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { activeSessionId, activeWebsocketUrl, draftMessage, setDraftMessage, startSession } =
    useChatbotSessionStore((state) => ({
      activeSessionId: state.activeSessionId,
      activeWebsocketUrl: state.activeWebsocketUrl,
      draftMessage: state.draftMessage,
      setDraftMessage: state.setDraftMessage,
      startSession: state.startSession,
    }));
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [composerHeight, setComposerHeight] = useState(0);
  const [streamingAssistantText, setStreamingAssistantText] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isAwaitingAssistant, setIsAwaitingAssistant] = useState(false);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const liveSessionId =
    routeSessionId && routeSessionId !== PREVIEW_SESSION_ID ? routeSessionId : activeSessionId;
  const liveWebsocketUrl =
    routeSessionId && routeSessionId !== PREVIEW_SESSION_ID
      ? undefined
      : activeWebsocketUrl ?? undefined;
  const previewPrompt = draftMessage.trim().length > 0 ? draftMessage.trim() : EMPTY_PREVIEW_PROMPT;
  const visibleMessages =
    isAwaitingAssistant || streamingAssistantText.length > 0
      ? [
          ...messages,
          {
            role: 'assistant' as const,
            content:
              streamingAssistantText.length > 0
                ? streamingAssistantText
                : WAITING_ASSISTANT_MESSAGE,
            created_at: 'streaming-assistant',
          },
        ]
      : messages;
  const hasConversation = visibleMessages.length > 0;
  const hasAssistantMessage = messages.some((message) => message.role === 'assistant');
  const feedbackBottomOffset = composerHeight + spacing.lg;
  const isSendDisabled = draftMessage.trim().length === 0 || isCreatingSession;

  useEffect(() => {
    if (!hasConversation) {
      return;
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [hasConversation, isAwaitingAssistant, messages.length, streamingAssistantText]);

  const handleSocketMessage = useEffectEvent((event: ChatbotServerSocketEvent) => {
    switch (event.type) {
      case 'assistant_token': {
        setSessionError(null);
        setIsAwaitingAssistant(true);
        setStreamingAssistantText((previousText) => previousText + event.content);
        break;
      }
      case 'assistant_message_done': {
        setMessages((previousMessages) => [
          ...previousMessages,
          createMessage('assistant', event.full_content),
        ]);
        setStreamingAssistantText('');
        setIsAwaitingAssistant(false);
        track(appEvents.chatbotResponseSucceeded, {
          session_id: connectedSessionIdRef.current,
        });
        break;
      }
      case 'error': {
        setStreamingAssistantText('');
        setIsAwaitingAssistant(false);
        setSessionError(event.message);
        track(appEvents.chatbotResponseFailed, {
          session_id: connectedSessionIdRef.current,
          error_code: event.code,
        });
        break;
      }
      case 'session_closed': {
        setStreamingAssistantText('');
        setIsAwaitingAssistant(false);
        break;
      }
    }
  });

  useEffect(() => {
    if (!accessToken || !liveSessionId) {
      return;
    }

    if (socketRef.current && connectedSessionIdRef.current === liveSessionId) {
      return;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      connectedSessionIdRef.current = null;
    }

    const socket = createChatbotSocket({
      accessToken,
      sessionId: liveSessionId,
      websocketUrl: liveWebsocketUrl,
      onMessage: handleSocketMessage,
    });

    socketRef.current = socket;
    connectedSessionIdRef.current = liveSessionId;

    socket.onopen = () => {
      setIsSocketReady(true);
      setSessionError(null);
    };

    socket.onerror = () => {
      setIsSocketReady(false);
      setIsCreatingSession(false);
      setIsAwaitingAssistant(false);
      setStreamingAssistantText('');
      setSessionError('채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.');
      track(appEvents.chatbotResponseFailed, {
        session_id: liveSessionId,
        error_code: 'SOCKET_CONNECTION_FAILED',
      });
    };

    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
        connectedSessionIdRef.current = null;
      }

      setIsSocketReady(false);
    };

    return () => {
      if (socketRef.current === socket) {
        socket.close();
        socketRef.current = null;
        connectedSessionIdRef.current = null;
        setIsSocketReady(false);
      }
    };
  }, [accessToken, handleSocketMessage, liveSessionId, liveWebsocketUrl]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/chatbot');
  };

  const handleComposerLayout = (event: LayoutChangeEvent) => {
    setComposerHeight(event.nativeEvent.layout.height);
  };

  const handleSend = async () => {
    const content = draftMessage.trim();

    if (content.length === 0) {
      return;
    }

    if (!accessToken) {
      setSessionError('로그인이 필요해요. 다시 로그인해주세요.');
      return;
    }

    if (!liveSessionId) {
      const optimisticUserMessage = createMessage('user', content);

      setMessages((previousMessages) => [...previousMessages, optimisticUserMessage]);
      setDraftMessage('');
      setSessionError(null);
      setIsCreatingSession(true);
      setIsAwaitingAssistant(true);
      setStreamingAssistantText('');

      try {
        const response = await startChatbotSession(buildStartSessionPayload(content));

        if (!response.success) {
          setMessages((previousMessages) =>
            previousMessages.filter(
              (message) => message.created_at !== optimisticUserMessage.created_at,
            ),
          );
          setDraftMessage(content);
          setIsAwaitingAssistant(false);
          setSessionError(response.error.message);
          track(appEvents.chatbotResponseFailed, {
            session_id: null,
            error_code: response.error.code,
          });
          return;
        }

        startSession(response.data.session_id, response.data.websocket_url);
        track(appEvents.chatbotStarted, {
          session_id: response.data.session_id,
          model_tier: response.data.model_tier,
        });
        return;
      } catch (error) {
        setMessages((previousMessages) =>
          previousMessages.filter(
            (message) => message.created_at !== optimisticUserMessage.created_at,
          ),
        );
        setDraftMessage(content);
        setIsAwaitingAssistant(false);
        setSessionError(
          getErrorMessage(error, '채팅을 시작하지 못했어요. 잠시 후 다시 시도해주세요.'),
        );
        track(appEvents.chatbotResponseFailed, {
          session_id: null,
          error_code: 'SESSION_CREATE_FAILED',
        });
        return;
      } finally {
        setIsCreatingSession(false);
      }
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !isSocketReady) {
      setSessionError('채팅 연결이 준비 중이에요. 잠시 후 다시 보내주세요.');
      return;
    }

    setSessionError(null);
    setMessages((previousMessages) => [...previousMessages, createMessage('user', content)]);
    setDraftMessage('');
    setIsAwaitingAssistant(true);
    setStreamingAssistantText('');
    sendChatbotMessage(socketRef.current, content);
  };

  const handleOpenDecisionFlow = () => {
    const decisionSessionId = liveSessionId ?? routeSessionId ?? PREVIEW_SESSION_ID;
    router.push(`/chatbot/decision/${decisionSessionId}` as never);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="뒤로가기"
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleGoBack}
            style={styles.backButton}
          >
            <ChevronLeftIcon />
          </Pressable>
          <Text style={styles.headerTitle}>AI 조언</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          {hasConversation ? (
            <View style={styles.messageStage}>
              <Watermark />
              <ScrollView
                ref={scrollViewRef}
                style={styles.messageScrollView}
                contentContainerStyle={[
                  styles.messageContent,
                  { paddingBottom: feedbackBottomOffset + 84 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {visibleMessages.map((message, index) => (
                  <MessageBubble
                    key={`${message.created_at}-${message.role}-${index}`}
                    message={message}
                  />
                ))}
              </ScrollView>
              {hasAssistantMessage ? (
                <View
                  pointerEvents="box-none"
                  style={[styles.feedbackPromptWrap, { bottom: feedbackBottomOffset }]}
                >
                  <FeedbackPrompt onPress={handleOpenDecisionFlow} />
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyStateWrapper}>
              <EmptyHero prompt={previewPrompt} />
            </View>
          )}
        </View>

        <View
          onLayout={handleComposerLayout}
          style={[
            styles.composerShell,
            {
              paddingBottom: Math.max(insets.bottom, spacing.xs),
            },
          ]}
        >
          {sessionError ? <Text style={styles.sessionErrorText}>{sessionError}</Text> : null}

          <View style={styles.composerRow}>
            <TextInput
              accessibilityLabel="채팅 입력"
              onChangeText={setDraftMessage}
              onSubmitEditing={() => {
                void handleSend();
              }}
              placeholder="원하는 물품과 가격을 알려주세요."
              placeholderTextColor={colors.gray400}
              returnKeyType="send"
              style={styles.composerInput}
              value={draftMessage}
            />
            <Pressable
              accessibilityLabel="메시지 전송"
              accessibilityRole="button"
              disabled={isSendDisabled}
              hitSlop={8}
              onPress={() => {
                void handleSend();
              }}
              style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
            >
              <SendIcon />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    height: 48,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  chevronStroke: {
    position: 'absolute',
    left: 2,
    width: 11,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.gray500,
  },
  chevronStrokeTop: {
    top: 5,
    transform: [{ rotate: '-45deg' }],
  },
  chevronStrokeBottom: {
    top: 11,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
    color: colors.gray800,
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  messageStage: {
    flex: 1,
    position: 'relative',
  },
  watermarkWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 92,
  },
  emptyStateWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 42,
  },
  emptyHero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyHeroTextWrap: {
    maxWidth: 180,
  },
  emptyHeroText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.black,
  },
  brandMark: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkCircle: {
    borderColor: colors.mint500,
    transform: [{ scaleX: 1.28 }, { scaleY: 1.28 }],
  },
  brandMarkGap: {
    position: 'absolute',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
  },
  brandMarkCap: {
    position: 'absolute',
    backgroundColor: colors.mint500,
  },
  brandMarkCapSoft: {
    opacity: 0.62,
  },
  messageScrollView: {
    flex: 1,
  },
  messageContent: {
    paddingTop: spacing.lg,
    paddingHorizontal: 20,
    gap: 20,
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  userMessageBubble: {
    maxWidth: 160,
    backgroundColor: colors.white,
    borderRadius: CHAT_BUBBLE_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  assistantMessageBubble: {
    maxWidth: 238,
    backgroundColor: colors.white,
    borderRadius: CHAT_BUBBLE_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chatMessageText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.black,
  },
  feedbackPromptWrap: {
    position: 'absolute',
    left: 36,
    right: 36,
    alignItems: 'center',
  },
  feedbackPrompt: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: colors.white,
    paddingLeft: 8,
    paddingRight: 18,
    paddingVertical: 6,
    shadowColor: colors.black,
    shadowOpacity: 0.03,
    shadowRadius: 17,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 2,
  },
  feedbackPromptText: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.black,
  },
  feedbackPromptLink: {
    color: colors.mint500,
    textDecorationLine: 'underline',
  },
  composerShell: {
    backgroundColor: colors.white,
    borderTopLeftRadius: COMPOSER_CORNER_RADIUS,
    borderTopRightRadius: COMPOSER_CORNER_RADIUS,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sessionErrorText: {
    marginBottom: spacing.sm,
    color: colors.red300,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
  },
  composerRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  composerInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    lineHeight: 22,
    color: colors.gray900,
  },
  sendButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray900,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.42,
  },
  sendIcon: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  sendIconBody: {
    position: 'absolute',
    left: 1,
    top: 5,
    width: 10,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: '-20deg' }],
  },
  sendIconWingTop: {
    position: 'absolute',
    right: 0,
    top: 2,
    width: 6,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: '35deg' }],
  },
  sendIconWingBottom: {
    position: 'absolute',
    right: 0,
    top: 7,
    width: 6,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.white,
    transform: [{ rotate: '-35deg' }],
  },
});
