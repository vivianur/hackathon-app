import React from 'react';
import * as ReactNative from 'react-native';
import { render } from '@testing-library/react-native';
import ScreenContainer from '@/components/layout/ScreenContainer';

jest.mock('@/hooks', () => ({
  useAdaptiveTheme: () => ({
    ui: {
      colors: {
        bg: '#f5f7fb',
        border: '#d1d5db',
      },
      spacing: {
        sm: 10,
        md: 12,
        lg: 16,
        xl: 20,
      },
      layout: {
        maxContentWidth: 900,
        isTabletFrame: false,
      },
      borders: {
        width: 1,
      },
      shape: {
        radius: 12,
      },
      mode: {
        dark: false,
        focus: false,
      },
    },
    settings: {
      animationsEnabled: false,
      focusMode: false,
      complexityLevel: 'moderate',
    },
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: 24,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

describe('ScreenContainer', () => {
  const originalPlatform = ReactNative.Platform.OS;
  let dimensionsSpy: jest.SpiedFunction<typeof ReactNative.useWindowDimensions>;

  beforeEach(() => {
    dimensionsSpy = jest
      .spyOn(ReactNative, 'useWindowDimensions')
      .mockImplementation(() => ({ width: 390, height: 844, scale: 1, fontScale: 1 }));

    Object.defineProperty(ReactNative.Platform, 'OS', {
      configurable: true,
      get: () => 'android',
    });
  });

  afterEach(() => {
    dimensionsSpy.mockRestore();

    Object.defineProperty(ReactNative.Platform, 'OS', {
      configurable: true,
      get: () => originalPlatform,
    });
  });

  it('adds the top safe-area inset to mobile content padding', () => {
    const screen = render(
      <ScreenContainer>
        <ReactNative.Text>Tela</ReactNative.Text>
      </ScreenContainer>
    );

    const scrollView = screen.UNSAFE_getByType(ReactNative.ScrollView);
    const contentStyle = ReactNative.StyleSheet.flatten(scrollView.props.contentContainerStyle);

    expect(contentStyle.paddingTop).toBe(40);
  });
});
