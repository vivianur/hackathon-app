import React from 'react';
import { Platform } from 'react-native';
import { render } from '@testing-library/react-native';
import VLibrasWidget from '@/components/VLibrasWidget';

jest.mock('@/hooks', () => ({
  useSettings: () => ({
    ready: true,
    settings: {
      vlibrasEnabled: true,
    },
  }),
  useAdaptiveTheme: () => ({
    ui: {
      mode: { monochrome: false },
      colors: { textPrimary: '#111', accent: '#be0079', border: '#ddd' },
      borders: { width: 1 },
      shape: { radius: 12 },
      typography: { small: 12 },
    },
  }),
}));

describe('VLibrasWidget', () => {
  it('does not render a mobile launcher outside the web platform', () => {
    const originalPlatform = Platform.OS;

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => 'ios',
    });

    const screen = render(<VLibrasWidget />);

    expect(screen.queryByLabelText('Abrir VLibras')).toBeNull();

    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      get: () => originalPlatform,
    });
  });
});
