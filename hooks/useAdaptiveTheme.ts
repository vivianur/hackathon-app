import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSettings } from './useSettings';

export function useAdaptiveTheme() {
  const { settings } = useSettings();

  const ui = useMemo(() => {
    const platformScale = Platform.select({
      ios: 1,
      android: 0.96,
      web: 0.9,
      default: 1,
    }) as number;

    const fontBaseMap = {
      small: 14,
      medium: 16,
      large: 18,
      'extra-large': 20,
    } as const;

    const spacingMap = {
      compact: { sm: 8, md: 10, lg: 12, xl: 14 },
      comfortable: { sm: 10, md: 12, lg: 16, xl: 20 },
      spacious: { sm: 12, md: 16, lg: 20, xl: 24 },
    } as const;

    const base = Math.round(fontBaseMap[settings.fontSize] * platformScale);
    const baseSpacing = spacingMap[settings.spacing];

    const complexityAdjust = {
      simple: { delta: -1, radius: 8 },
      moderate: { delta: 0, radius: 12 },
      detailed: { delta: 1, radius: 14 },
    } as const;

    const complexity = complexityAdjust[settings.complexityLevel];

    const spacing = {
      sm: Math.max(baseSpacing.sm + complexity.delta, 6),
      md: Math.max(baseSpacing.md + complexity.delta, 8),
      lg: Math.max(baseSpacing.lg + complexity.delta, 10),
      xl: Math.max(baseSpacing.xl + complexity.delta, 12),
    };

    const isDark = settings.darkMode;
    const isMonochrome = settings.detailedMode;
    const isHighContrast = settings.contrastLevel === 'medium';
    const isFocusMode = settings.focusMode;

    const accent = isMonochrome
      ? isDark
        ? '#9ca3af'
        : '#6b7280'
      : isDark
        ? '#ff00d0'
        : '#be0079';

    const switchTrackOn = isMonochrome
      ? isDark
        ? '#9ca3af'
        : '#6b7280'
      : isDark
        ? '#ff00d0'
        : '#be0079';

    const switchTrackOff = isDark ? '#6b7280' : '#b0b8c2';
    const switchThumbOn = '#ffffff';
    const switchThumbOff = '#ffffff';

    const contrastTextLight = isHighContrast ? '#111827' : '#4b5563';
    const contrastTextDark = isHighContrast ? '#f9fafb' : '#d1d5db';
    const contrastSecondaryLight = isHighContrast ? '#374151' : '#9ca3af';
    const contrastSecondaryDark = isHighContrast ? '#e5e7eb' : '#9ca3af';
    const contrastBorderLight = isHighContrast ? '#9ca3af' : '#e5e7eb';
    const contrastBorderDark = isHighContrast ? '#6b7280' : '#374151';

    return {
      colors: {
        accent,
        bg: isDark ? '#111827' : '#f5f7fb',
        surface: isDark ? '#1f2937' : '#ffffff',
        textPrimary: isDark ? contrastTextDark : contrastTextLight,
        textSecondary: isDark ? contrastSecondaryDark : contrastSecondaryLight,
        border: isDark ? contrastBorderDark : contrastBorderLight,
        borderSoft: isDark ? (isHighContrast ? '#4b5563' : '#374151') : (isHighContrast ? '#d1d5db' : '#f3f4f6'),
      },
      typography: {
        h1: Math.round(base * 1.5),
        h2: Math.round(base * 1.25),
        h3: Math.round(base * 1.05),
        body: base,
        small: Math.max(base - 2, 11),
      },
      spacing,
      layout: {
        maxContentWidth: Platform.OS === 'web' ? 900 : undefined,
        isTabletFrame: Platform.OS === 'web',
      },
      switch: {
        trackOn: switchTrackOn,
        trackOff: switchTrackOff,
        thumbOn: switchThumbOn,
        thumbOff: switchThumbOff,
      },
      shape: {
        radius: complexity.radius,
      },
      borders: {
        width: isHighContrast ? 2 : 1,
      },
      content: {
        showSecondaryText: !isFocusMode && settings.complexityLevel !== 'simple',
        showSupportPanels: !isFocusMode && settings.complexityLevel !== 'simple',
        showExtendedDetails: !isFocusMode && settings.complexityLevel === 'detailed',
      },
      mode: {
        dark: isDark,
        focus: isFocusMode,
        monochrome: isMonochrome,
      },
    };
  }, [settings]);

  return { ui, settings };
}
