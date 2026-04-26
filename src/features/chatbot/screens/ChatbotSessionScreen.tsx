import { useEffect, useRef, useState } from 'react';
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

import type { ChatbotMessage } from '@/api/types/chatbot';
import { appEvents } from '@/services/tracking/events';
import { track } from '@/services/tracking/tracker';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors, spacing } from '@/theme';

const EMPTY_PREVIEW_PROMPT = '30만원 중고\n에어팟을 구매할까?';
const DEFAULT_ASSISTANT_REPLY =
  '효현님의 소비습관을 분석해본 결과,\n이미 이어폰 소비 내역이 있어서 비추천 합니다.';
const GENERIC_ASSISTANT_REPLY =
  '최근 비슷한 소비와 카테고리 만족도를 같이 보면,\n지금 필요한 지출인지 더 선명하게 판단할 수 있어요.';
const COMPOSER_CORNER_RADIUS = 24;
const CHAT_BUBBLE_RADIUS = 12;
const HERO_MARK_SIZE = 100;
const AVATAR_MARK_SIZE = 30;
const WATERMARK_MARK_SIZE = 120;

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

function createPreviewMessages(prompt: string): ChatbotMessage[] {
  const createdAt = new Date().toISOString();
  const assistantReply = prompt.includes('에어팟')
    ? DEFAULT_ASSISTANT_REPLY
    : GENERIC_ASSISTANT_REPLY;

  return [
    {
      role: 'user',
      content: prompt,
      created_at: createdAt,
    },
    {
      role: 'assistant',
      content: assistantReply,
      created_at: createdAt,
    },
  ];
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

function FeedbackPrompt() {
  return (
    <Pressable accessibilityRole="button" onPress={() => undefined} style={styles.feedbackPrompt}>
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

export function ChatbotSessionScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const hasTrackedStartRef = useRef(false);
  const { draftMessage, setDraftMessage } = useChatbotSessionStore((state) => ({
    draftMessage: state.draftMessage,
    setDraftMessage: state.setDraftMessage,
  }));
  const previewPrompt = draftMessage.trim().length > 0 ? draftMessage.trim() : EMPTY_PREVIEW_PROMPT;
  const [messages, setMessages] = useState<ChatbotMessage[]>(() =>
    sessionId ? createPreviewMessages(previewPrompt) : [],
  );
  const [composerHeight, setComposerHeight] = useState(0);
  const hasConversation = messages.length > 0;
  const hasAssistantMessage = messages.some((message) => message.role === 'assistant');
  const feedbackBottomOffset = composerHeight + spacing.lg;

  useEffect(() => {
    if (!hasConversation) {
      return;
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [hasConversation, messages]);

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

  const handleSend = () => {
    const content = draftMessage.trim();

    if (content.length === 0) {
      return;
    }

    if (!hasTrackedStartRef.current) {
      track(appEvents.chatbotStarted, { session_id: sessionId ?? null });
      hasTrackedStartRef.current = true;
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      },
    ]);
    setDraftMessage('');
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
                {messages.map((message) => (
                  <MessageBubble
                    key={`${message.created_at}-${message.role}-${message.content}`}
                    message={message}
                  />
                ))}
              </ScrollView>
              {hasAssistantMessage ? (
                <View
                  pointerEvents="box-none"
                  style={[styles.feedbackPromptWrap, { bottom: feedbackBottomOffset }]}
                >
                  <FeedbackPrompt />
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
          <View style={styles.composerRow}>
            <TextInput
              accessibilityLabel="채팅 입력"
              onChangeText={setDraftMessage}
              onSubmitEditing={handleSend}
              placeholder="원하는 물품과 가격을 알려주세요."
              placeholderTextColor={colors.gray400}
              returnKeyType="send"
              style={styles.composerInput}
              value={draftMessage}
            />
            <Pressable
              accessibilityLabel="메시지 전송"
              accessibilityRole="button"
              hitSlop={8}
              onPress={handleSend}
              style={[
                styles.sendButton,
                draftMessage.trim().length === 0 && styles.sendButtonIdle,
              ]}
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
    maxWidth: 120,
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
  sendButtonIdle: {
    opacity: 0.88,
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
