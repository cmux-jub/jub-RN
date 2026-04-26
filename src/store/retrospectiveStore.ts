import { create } from 'zustand';

type RetrospectiveStore = {
  currentWeekStart: string | null;
  completedTransactionIds: string[];
  setCurrentWeek: (weekStart: string) => void;
  markTransactionCompleted: (transactionId: string) => void;
  resetRetrospective: () => void;
};

export const useRetrospectiveStore = create<RetrospectiveStore>((set) => ({
  currentWeekStart: null,
  completedTransactionIds: [],
  setCurrentWeek: (currentWeekStart) => set({ currentWeekStart }),
  markTransactionCompleted: (transactionId) =>
    set((state) => ({
      completedTransactionIds: [...new Set([...state.completedTransactionIds, transactionId])],
    })),
  resetRetrospective: () =>
    set({
      currentWeekStart: null,
      completedTransactionIds: [],
    }),
}));
