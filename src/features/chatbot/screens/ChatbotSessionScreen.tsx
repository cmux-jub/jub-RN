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
import { track } from '@/services/tracking/tracker';
import { appEvents } from '@/services/tracking/events';
import { useChatbotSessionStore } from '@/store/chatbotSessionStore';
import { colors, radius, spacing } from '@/theme';

const EMPTY_PREVIEW_PROMPT = '30만원 중고 에어팟을 구매할까?';

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

function EmptyHero({ prompt }: { prompt: string }) {
  return (
    <View style={styles.emptyHero}>
      <View style={styles.heroRing}>
        <View style={styles.heroRingCircle} />
        <View style={styles.heroRingGap} />
        <View style={[styles.heroRingCap, styles.heroRingCapLeft]} />
        <View style={[styles.heroRingCap, styles.heroRingCapRight]} />
      </View>
      <Text style={styles.emptyHeroText}>{prompt}</Text>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatbotMessage }) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
      <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant]}>
        <Text style={[styles.messageText, isUser ? styles.messageTextUser : styles.messageTextAssistant]}>
          {message.content}
        </Text>
      </View>
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
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [composerHeight, setComposerHeight] = useState(0);
  const [previewPrompt] = useState(() => {
    const normalizedPrompt = draftMessage.trim();
    return normalizedPrompt.length > 0 ? normalizedPrompt : EMPTY_PREVIEW_PROMPT;
  });

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

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
          {messages.length === 0 ? (
            <View style={styles.emptyStateWrapper}>
              <EmptyHero prompt={previewPrompt} />
            </View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              style={styles.messageScrollView}
              contentContainerStyle={[
                styles.messageContent,
                { paddingBottom: composerHeight + spacing.lg },
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
  heroRing: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroRingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 13,
    borderColor: colors.mint500,
    transform: [{ scaleX: 1.28 }, { scaleY: 1.28 }],
    opacity: 0.88,
  },
  heroRingGap: {
    position: 'absolute',
    bottom: 6,
    width: 50,
    height: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.gray100,
  },
  heroRingCap: {
    position: 'absolute',
    bottom: 14,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.mint500,
  },
  heroRingCapLeft: {
    left: 18,
    opacity: 0.94,
  },
  heroRingCapRight: {
    right: 18,
    opacity: 0.62,
  },
  emptyHeroText: {
    maxWidth: 180,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.black,
  },
  messageScrollView: {
    flex: 1,
  },
  messageContent: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
  },
  messageRowAssistant: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  messageBubbleAssistant: {
    backgroundColor: colors.white,
  },
  messageBubbleUser: {
    backgroundColor: colors.gray900,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextAssistant: {
    color: colors.gray800,
  },
  messageTextUser: {
    color: colors.white,
  },
  composerShell: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
