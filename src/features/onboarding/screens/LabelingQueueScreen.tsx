import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchOnboardingQuestions, submitOnboardingFeedback } from '@/api/onboarding';
import type { OnboardingFeedbackAnswerInput, OnboardingQuestionItem } from '@/api/types/onboarding';
import { DataGapState } from '@/components/states/DataGapState';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { colors } from '@/theme/colors';

const FIGMA_SCREEN_HEIGHT = 852;
const HEADER_HEIGHT = 48;
const FIGMA_QUESTION_TOP = 220;
const FIGMA_BOTTOM_SHEET_HEIGHT = 380;
const SCORE_OPTIONS = [1, 2, 3, 4, 5] as const;

const COPY = {
  title: '소비 회고',
  optionalLabel: '한 줄 메모',
  notePlaceholder: '선택 사항이에요. 느낀 점이 있으면 짧게 남겨주세요.',
} as const;

type ScreenState = 'loading' | 'ready' | 'submitting' | 'error';

export function LabelingQueueScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const setFeedbackResult = useOnboardingStore((state) => state.setFeedbackResult);
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<OnboardingQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [answers, setAnswers] = useState<OnboardingFeedbackAnswerInput[]>([]);

  const questionTop = Math.max(176, Math.round(height * (FIGMA_QUESTION_TOP / FIGMA_SCREEN_HEIGHT)));
  const bottomSheetHeight = Math.max(
    360,
    Math.round(height * (FIGMA_BOTTOM_SHEET_HEIGHT / FIGMA_SCREEN_HEIGHT)),
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadQuestions() {
      setScreenState('loading');
      setErrorMessage(null);

      try {
        const response = await fetchOnboardingQuestions();

        if (isCancelled) {
          return;
        }

        if (!response.success) {
          setQuestions([]);
          setScreenState('error');
          setErrorMessage(response.error.message);
          return;
        }

        setQuestions(response.data.questions);
        setCurrentIndex(0);
        setSelectedScore(null);
        setNote('');
        setAnswers([]);
        setScreenState('ready');
      } catch (error) {
        if (!isCancelled) {
          setQuestions([]);
          setScreenState('error');
          setErrorMessage(
            error instanceof Error ? error.message : '온보딩 질문을 불러오지 못했어요.',
          );
        }
      }
    }

    void loadQuestions();

    return () => {
      isCancelled = true;
    };
  }, []);

  const candidate = questions[currentIndex] ?? null;
  const isLastQuestion = candidate !== null && currentIndex === questions.length - 1;
  const canContinue = selectedScore !== null && screenState !== 'submitting';
  const progressLabel = useMemo(() => {
    if (questions.length === 0) {
      return '';
    }

    return `${currentIndex + 1} / ${questions.length}`;
  }, [currentIndex, questions.length]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/insights' as never);
  };

  const handleRetry = async () => {
    setScreenState('loading');
    setErrorMessage(null);

    try {
      const response = await fetchOnboardingQuestions();

      if (!response.success) {
        setScreenState('error');
        setErrorMessage(response.error.message);
        return;
      }

      setQuestions(response.data.questions);
      setCurrentIndex(0);
      setSelectedScore(null);
      setNote('');
      setAnswers([]);
      setScreenState('ready');
    } catch (error) {
      setScreenState('error');
      setErrorMessage(
        error instanceof Error ? error.message : '온보딩 질문을 불러오지 못했어요.',
      );
    }
  };

  const handleNext = async () => {
    if (!candidate || selectedScore === null) {
      return;
    }

    const nextAnswer: OnboardingFeedbackAnswerInput = {
      question_id: candidate.question_id,
      transaction_id: candidate.transaction.transaction_id,
      score: selectedScore,
      ...(note.trim().length > 0 ? { text: note.trim() } : {}),
    };

    const nextAnswers = [...answers, nextAnswer];

    if (!isLastQuestion) {
      setAnswers(nextAnswers);
      setCurrentIndex((previousIndex) => previousIndex + 1);
      setSelectedScore(null);
      setNote('');
      return;
    }

    setScreenState('submitting');
    setErrorMessage(null);

    try {
      const response = await submitOnboardingFeedback({ answers: nextAnswers });

      if (!response.success) {
        setScreenState('ready');
        setErrorMessage(response.error.message);
        return;
      }

      setFeedbackResult(response.data);
      useAuthStore.setState((state) => ({
        ...state,
        onboardingStatus: response.data.is_chatbot_unlocked ? 'READY' : 'NEEDS_LABELING',
      }));
      router.replace('/onboarding/first-insight' as never);
    } catch (error) {
      setScreenState('ready');
      setErrorMessage(
        error instanceof Error ? error.message : '온보딩 답변을 저장하지 못했어요.',
      );
    }
  };

  if (screenState === 'loading') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.emptyStateWrap}>
          <DataGapState message="온보딩 질문을 준비하고 있어요." />
        </View>
      </SafeAreaView>
    );
  }

  if (screenState === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.emptyStateWrap}>
          <DataGapState message={errorMessage ?? '온보딩 질문을 불러오지 못했어요.'} />
          <Pressable accessibilityRole="button" onPress={() => void handleRetry()} style={styles.retryButton}>
            <Text style={styles.retryButtonLabel}>다시 시도</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!candidate) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.emptyStateWrap}>
          <DataGapState message="지금 보여드릴 온보딩 질문이 없어요." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={handleBack}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>{'<'}</Text>
          </Pressable>
          <Text style={styles.headerTitle}>{COPY.title}</Text>
          <Text style={styles.headerProgress}>{progressLabel}</Text>
        </View>

        <View style={[styles.questionWrap, { top: questionTop }]}>
          <Text style={styles.questionTitle}>{candidate.question.title}</Text>
          <Text style={styles.questionBody}>{candidate.question.body}</Text>
          <Text style={styles.questionPattern}>{candidate.pattern_summary}</Text>
        </View>

        <View
          style={[
            styles.bottomSheet,
            {
              height: bottomSheetHeight + insets.bottom,
              paddingBottom: Math.max(20, insets.bottom + 8),
            },
          ]}
        >
          <View style={styles.scoreRow}>
            {SCORE_OPTIONS.map((score) => {
              const isSelected = selectedScore === score;

              return (
                <Pressable
                  key={score}
                  accessibilityRole="button"
                  onPress={() => setSelectedScore(score)}
                  style={({ pressed }) => [
                    styles.scoreButton,
                    isSelected && styles.scoreButtonSelected,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={[styles.scoreLabel, isSelected && styles.scoreLabelSelected]}>
                    {score}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.scoreGuide}>
            {candidate.question.score_scale.min_label} · {candidate.question.score_scale.max_label}
          </Text>

          <View style={styles.noteBlock}>
            <Text style={styles.noteLabel}>{COPY.optionalLabel}</Text>
            <TextInput
              multiline
              onChangeText={setNote}
              placeholder={COPY.notePlaceholder}
              placeholderTextColor={colors.gray400}
              style={styles.noteInput}
              textAlignVertical="top"
              value={note}
            />
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={!canContinue}
            onPress={() => void handleNext()}
            style={({ pressed }) => [
              styles.submitButton,
              !canContinue && styles.submitButtonDisabled,
              pressed && canContinue && styles.buttonPressed,
            ]}
          >
            <Text style={styles.submitButtonLabel}>
              {screenState === 'submitting'
                ? '저장 중...'
                : isLastQuestion
                  ? '답변 제출'
                  : '다음 질문'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.gray500,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 28,
  },
  headerTitle: {
    color: colors.gray800,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  headerProgress: {
    color: colors.gray500,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    minWidth: 40,
    textAlign: 'right',
  },
  questionWrap: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 14,
  },
  questionTitle: {
    color: colors.gray900,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
  questionBody: {
    color: colors.gray600,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  questionPattern: {
    color: colors.gray500,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  scoreButtonSelected: {
    backgroundColor: colors.black,
  },
  scoreLabel: {
    color: colors.gray700,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  scoreLabelSelected: {
    color: colors.white,
  },
  scoreGuide: {
    color: colors.gray500,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  noteBlock: {
    gap: 8,
  },
  noteLabel: {
    color: colors.gray900,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  noteInput: {
    minHeight: 92,
    borderRadius: 8,
    backgroundColor: colors.gray50,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.gray900,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: colors.red300,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  submitButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.black,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  submitButtonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  emptyStateWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 16,
  },
  retryButton: {
    alignSelf: 'center',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonPressed: {
    opacity: 0.82,
  },
});
