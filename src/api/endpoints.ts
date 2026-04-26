export const endpoints = {
  auth: {
    signUp: '/auth/signup',
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/users/me',
  },
  banking: {
    oauthStart: '/banking/oauth/start',
    oauthCallback: '/banking/oauth/callback',
    sync: '/banking/sync',
  },
  onboarding: {
    questions: '/onboarding/questions',
    feedback: '/onboarding/feedback',
    transactionsToLabel: '/onboarding/transactions-to-label',
    progress: '/onboarding/progress',
    firstInsight: '/onboarding/first-insight',
  },
  transactions: {
    list: '/transactions',
  },
  chatbot: {
    sessions: '/chatbot/sessions',
  },
  retrospectives: {
    currentWeek: '/retrospectives/current-week',
    list: '/retrospectives',
  },
  insights: {
    main: '/insights/main',
    happyPurchases: '/insights/happy-purchases',
    savedAmount: '/insights/saved-amount',
    categorySatisfaction: '/insights/category-satisfaction',
    scoreTrend: '/insights/score-trend',
  },
  subscription: {
    root: '/subscription',
    upgrade: '/subscription/upgrade',
  },
} as const;
