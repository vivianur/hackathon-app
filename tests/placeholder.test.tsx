import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { SettingsProvider, useSettings } from '@/hooks';

describe('app smoke', () => {
  it('hydrates settings provider successfully', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SettingsProvider>{children}</SettingsProvider>
    );

    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.ready).toBe(true));

    expect(result.current.settings.preferences.notifications).toBe(true);
  });
});
