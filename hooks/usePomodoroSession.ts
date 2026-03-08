import React from 'react';
import { getTransitionWarningMessage } from '@/services/feedback';

type PomodoroPhase = 'focus' | 'break';

type UsePomodoroSessionOptions = {
  focusDurationMinutes: number;
  breakDurationMinutes: number;
  transitionWarningsEnabled: boolean;
  onTransitionWarning?: (nextPhase: PomodoroPhase) => void | Promise<void>;
  onComplete?: (completedPhase: PomodoroPhase) => void | Promise<void>;
};

function toSeconds(minutes: number) {
  return Math.max(1, Math.round(minutes * 60));
}

export function usePomodoroSession({
  focusDurationMinutes,
  breakDurationMinutes,
  transitionWarningsEnabled,
  onTransitionWarning,
  onComplete,
}: UsePomodoroSessionOptions) {
  const [phase, setPhase] = React.useState<PomodoroPhase>('focus');
  const [secondsRemaining, setSecondsRemaining] = React.useState(() => toSeconds(focusDurationMinutes));
  const [running, setRunning] = React.useState(false);
  const [warningVisible, setWarningVisible] = React.useState(false);
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null);
  const hasWarnedForCurrentPhase = React.useRef(false);

  const getDurationForPhase = React.useCallback(
    (targetPhase: PomodoroPhase) =>
      targetPhase === 'focus' ? toSeconds(focusDurationMinutes) : toSeconds(breakDurationMinutes),
    [breakDurationMinutes, focusDurationMinutes]
  );

  const dismissWarning = React.useCallback(() => {
    setWarningVisible(false);
    setWarningMessage(null);
  }, []);

  const start = React.useCallback(() => {
    setRunning(true);
  }, []);

  const pause = React.useCallback(() => {
    setRunning(false);
  }, []);

  const reset = React.useCallback(() => {
    hasWarnedForCurrentPhase.current = false;
    setRunning(false);
    dismissWarning();
    setSecondsRemaining(getDurationForPhase(phase));
  }, [dismissWarning, getDurationForPhase, phase]);

  React.useEffect(() => {
    if (!running) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = Math.max(prev - 1, 0);
        const nextPhase: PomodoroPhase = phase === 'focus' ? 'break' : 'focus';

        if (transitionWarningsEnabled && next === 60 && !hasWarnedForCurrentPhase.current) {
          const message = getTransitionWarningMessage({
            enabled: true,
            nextPhase,
          });

          if (message) {
            hasWarnedForCurrentPhase.current = true;
            setWarningVisible(true);
            setWarningMessage(message);
            void onTransitionWarning?.(nextPhase);
          }
        }

        if (next === 0) {
          const completedPhase = phase;

          hasWarnedForCurrentPhase.current = false;
          setRunning(false);
          dismissWarning();
          setPhase(nextPhase);
          void onComplete?.(completedPhase);
          return getDurationForPhase(nextPhase);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    dismissWarning,
    getDurationForPhase,
    onComplete,
    onTransitionWarning,
    phase,
    running,
    transitionWarningsEnabled,
  ]);

  return {
    phase,
    secondsRemaining,
    running,
    warningVisible,
    warningMessage,
    start,
    pause,
    reset,
    dismissWarning,
  } as const;
}
