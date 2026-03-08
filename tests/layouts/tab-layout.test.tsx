import React from 'react';
import * as ReactNative from 'react-native';
import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout';

let mockedWidth = 390;
let capturedScreenOptions: Record<string, unknown> | null = null;

jest.mock('expo-router', () => {
  const React = require('react');

  const Tabs = ({ screenOptions, children }: { screenOptions: Record<string, unknown>; children: React.ReactNode }) => {
    capturedScreenOptions = screenOptions;
    return React.createElement(React.Fragment, null, children);
  };

  Tabs.Screen = () => null;

  return { Tabs };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@/hooks', () => ({
  useAdaptiveTheme: () => ({
    ui: {
      mode: { dark: false, monochrome: false },
      colors: { accent: '#be0079' },
      layout: { maxContentWidth: 900, isTabletFrame: false },
    },
  }),
}));

describe('TabLayout', () => {
  const originalPlatform = ReactNative.Platform.OS;
  let dimensionsSpy: jest.SpiedFunction<typeof ReactNative.useWindowDimensions>;

  beforeEach(() => {
    dimensionsSpy = jest
      .spyOn(ReactNative, 'useWindowDimensions')
      .mockImplementation(() => ({ width: mockedWidth, height: 844, scale: 1, fontScale: 1 }));
  });

  afterEach(() => {
    capturedScreenOptions = null;
    mockedWidth = 390;
    dimensionsSpy.mockRestore();
    Object.defineProperty(ReactNative.Platform, 'OS', {
      configurable: true,
      get: () => originalPlatform,
    });
  });

  it('uses a bottom tab bar on mobile', () => {
    Object.defineProperty(ReactNative.Platform, 'OS', {
      configurable: true,
      get: () => 'ios',
    });

    render(<TabLayout />);

    expect(capturedScreenOptions?.tabBarPosition).toBe('bottom');
  });

  it('keeps the tab bar on top on web', () => {
    mockedWidth = 1280;

    Object.defineProperty(ReactNative.Platform, 'OS', {
      configurable: true,
      get: () => 'web',
    });

    render(<TabLayout />);

    expect(capturedScreenOptions?.tabBarPosition).toBe('top');
  });
});
