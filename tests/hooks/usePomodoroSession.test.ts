import { act, renderHook } from '@testing-library/react-native';
import { usePomodoroSession } from '@/hooks/usePomodoroSession';

describe('usePomodoroSession', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses the profile focus duration as the initial countdown', () => {
    const { result } = renderHook(() =>
      usePomodoroSession({
        focusDurationMinutes: 30,
        breakDurationMinutes: 10,
        transitionWarningsEnabled: true,
      })
    );

    expect(result.current.secondsRemaining).toBe(30 * 60);
    expect(result.current.phase).toBe('focus');
  });

  it('shows a transition warning at one minute remaining when enabled', () => {
    const { result } = renderHook(() =>
      usePomodoroSession({
        focusDurationMinutes: 2,
        breakDurationMinutes: 1,
        transitionWarningsEnabled: true,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(result.current.warningVisible).toBe(true);
    expect(result.current.warningMessage).toBe(
      'A sessao atual termina em 1 minuto. Prepare-se para uma pausa curta.'
    );
  });

  it('switches to break time and calls completion callback when the focus session ends', () => {
    const onComplete = jest.fn();

    const { result } = renderHook(() =>
      usePomodoroSession({
        focusDurationMinutes: 1,
        breakDurationMinutes: 5,
        transitionWarningsEnabled: false,
        onComplete,
      })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(onComplete).toHaveBeenCalledWith('focus');
    expect(result.current.phase).toBe('break');
    expect(result.current.secondsRemaining).toBe(5 * 60);
    expect(result.current.running).toBe(false);
  });
});
