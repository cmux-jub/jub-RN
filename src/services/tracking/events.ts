export const appEvents = {
  chatbotStarted: 'chatbot_started',
  chatbotResponseSucceeded: 'chatbot_response_succeeded',
  chatbotResponseFailed: 'chatbot_response_failed',
  chatbotDecisionSelected: 'chatbot_decision_selected',
  chatbotSummaryViewed: 'chatbot_summary_viewed',
  retrospectiveViewed: 'retrospective_viewed',
  retrospectiveCompleted: 'retrospective_completed',
  archiveViewed: 'archive_viewed',
  savedAmountViewed: 'saved_amount_viewed',
} as const;

export type AppEventName = (typeof appEvents)[keyof typeof appEvents];
