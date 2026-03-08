import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { SettingsProvider, useSettings } from '@/hooks';
import { DEFAULT_SETTINGS } from '@/types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

describe('useSettings', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('provides default settings on first load', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.ready).toBe(true));

    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('merges preference updates without dropping other flags', async () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => {
      result.current.updatePreferences({ notifications: false });
    });

    expect(result.current.settings.preferences).toEqual({
      ...DEFAULT_SETTINGS.preferences,
      notifications: false,
    });
  });
});
