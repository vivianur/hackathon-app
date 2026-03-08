import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { FeedbackProvider, useFeedbackCenter } from '@/hooks/useFeedbackCenter';
import { playFeedbackSound } from '@/services/feedback/audio';
import { sendLocalFeedbackNotification } from '@/services/feedback/notifications';

jest.mock('@/services/feedback/audio', () => ({
  playFeedbackSound: jest.fn().mockResolvedValue(true),
}));

jest.mock('@/services/feedback/notifications', () => ({
  sendLocalFeedbackNotification: jest.fn().mockResolvedValue(true),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FeedbackProvider>{children}</FeedbackProvider>
);

describe('useFeedbackCenter', () => {
  it('queues an encouragement banner and triggers sound/notification on task completion', async () => {
    const { result } = renderHook(() => useFeedbackCenter(), { wrapper });

    await act(async () => {
      await result.current.celebrateTaskCompletion({
        notifications: true,
        soundEffects: true,
        encouragementMessages: true,
        seed: 0,
      });
    });

    await waitFor(() =>
      expect(result.current.activeBanner?.message).toBe('Bom trabalho. Uma etapa foi concluida.')
    );
    expect(playFeedbackSound).toHaveBeenCalledTimes(1);
    expect(sendLocalFeedbackNotification).toHaveBeenCalledWith({
      title: 'MindEase',
      body: 'Bom trabalho. Uma etapa foi concluida.',
    });
  });

  it('does not queue a transition banner when warnings are disabled', async () => {
    const { result } = renderHook(() => useFeedbackCenter(), { wrapper });

    await act(async () => {
      await result.current.warnAboutTransition({
        transitionWarnings: false,
        nextPhase: 'break',
      });
    });

    expect(result.current.activeBanner).toBeNull();
  });

  it('queues a transition banner when warnings are enabled', async () => {
    const { result } = renderHook(() => useFeedbackCenter(), { wrapper });

    await act(async () => {
      await result.current.warnAboutTransition({
        transitionWarnings: true,
        nextPhase: 'focus',
      });
    });

    await waitFor(() =>
      expect(result.current.activeBanner?.message).toBe(
        'A sessao atual termina em 1 minuto. Prepare-se para voltar ao foco.'
      )
    );
  });
});
