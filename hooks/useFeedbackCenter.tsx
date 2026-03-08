import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getEncouragementMessage,
  getPomodoroCompletionMessage,
  getTaskCompletionMessage,
  getTransitionWarningMessage,
} from '@/services/feedback';
import { playFeedbackSound } from '@/services/feedback/audio';
import { sendLocalFeedbackNotification } from '@/services/feedback/notifications';

export type FeedbackBannerTone = 'info' | 'success' | 'warning';

export type FeedbackBanner = {
  id: number;
  message: string;
  tone: FeedbackBannerTone;
};

type CompletionPreferences = {
  notifications: boolean;
  soundEffects: boolean;
  encouragementMessages: boolean;
  seed?: number;
};

type TransitionWarningPreferences = {
  transitionWarnings: boolean;
  nextPhase: 'focus' | 'break';
};

type PomodoroCompletionPreferences = CompletionPreferences & {
  phase: 'focus' | 'break';
};

type FeedbackContextValue = {
  activeBanner: FeedbackBanner | null;
  dismissBanner: () => void;
  showBanner: (message: string, tone?: FeedbackBannerTone) => void;
  celebrateTaskCompletion: (preferences: CompletionPreferences) => Promise<void>;
  celebratePomodoroCompletion: (preferences: PomodoroCompletionPreferences) => Promise<void>;
  warnAboutTransition: (preferences: TransitionWarningPreferences) => Promise<void>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [activeBanner, setActiveBanner] = useState<FeedbackBanner | null>(null);

  const dismissBanner = useCallback(() => {
    setActiveBanner(null);
  }, []);

  const showBanner = useCallback((message: string, tone: FeedbackBannerTone = 'info') => {
    setActiveBanner({
      id: Date.now(),
      message,
      tone,
    });
  }, []);

  const sendCompletionFeedback = useCallback(
    async (
      preferences: CompletionPreferences,
      neutralMessage: string,
      encouragementMessage: string | null
    ) => {
      const message =
        encouragementMessage ?? (preferences.notifications ? neutralMessage : null);

      await playFeedbackSound(preferences.soundEffects);

      if (!message) {
        return;
      }

      showBanner(message, 'success');

      if (preferences.notifications) {
        await sendLocalFeedbackNotification({
          title: 'MindEase',
          body: message,
        });
      }
    },
    [showBanner]
  );

  const celebrateTaskCompletion = useCallback(
    async (preferences: CompletionPreferences) => {
      const encouragementMessage = getEncouragementMessage({
        enabled: preferences.encouragementMessages,
        seed: preferences.seed,
      });

      await sendCompletionFeedback(
        preferences,
        getTaskCompletionMessage(),
        encouragementMessage
      );
    },
    [sendCompletionFeedback]
  );

  const celebratePomodoroCompletion = useCallback(
    async (preferences: PomodoroCompletionPreferences) => {
      const encouragementMessage = getEncouragementMessage({
        enabled: preferences.encouragementMessages,
        seed: preferences.seed,
      });

      await sendCompletionFeedback(
        preferences,
        getPomodoroCompletionMessage(preferences.phase),
        encouragementMessage
      );
    },
    [sendCompletionFeedback]
  );

  const warnAboutTransition = useCallback(
    async (preferences: TransitionWarningPreferences) => {
      const message = getTransitionWarningMessage({
        enabled: preferences.transitionWarnings,
        nextPhase: preferences.nextPhase,
      });

      if (!message) {
        return;
      }

      showBanner(message, 'warning');
    },
    [showBanner]
  );

  const value = useMemo(
    () => ({
      activeBanner,
      dismissBanner,
      showBanner,
      celebrateTaskCompletion,
      celebratePomodoroCompletion,
      warnAboutTransition,
    }),
    [
      activeBanner,
      celebratePomodoroCompletion,
      celebrateTaskCompletion,
      dismissBanner,
      showBanner,
      warnAboutTransition,
    ]
  );

  return (
    <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>
  );
}

export function useFeedbackCenter() {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error('useFeedbackCenter must be used within FeedbackProvider');
  }

  return context;
}
