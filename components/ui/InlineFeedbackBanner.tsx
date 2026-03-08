import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAdaptiveTheme, useFeedbackCenter } from '@/hooks';

const AUTO_DISMISS_MS = 4500;

export default function InlineFeedbackBanner() {
  const { activeBanner, dismissBanner } = useFeedbackCenter();
  const { ui } = useAdaptiveTheme();

  React.useEffect(() => {
    if (!activeBanner) {
      return;
    }

    const timeout = setTimeout(() => {
      dismissBanner();
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timeout);
  }, [activeBanner, dismissBanner]);

  if (!activeBanner) {
    return null;
  }

  const bannerBackground =
    activeBanner.tone === 'warning'
      ? ui.mode.monochrome
        ? ui.colors.surface
        : '#fff4d6'
      : ui.mode.monochrome
        ? ui.colors.surface
        : '#f2e8ff';

  return (
    <View
      style={[styles.wrapper, { pointerEvents: 'box-none' }]}>
      <Pressable
        onPress={dismissBanner}
        style={[
          styles.banner,
          {
            backgroundColor: bannerBackground,
            borderColor: ui.colors.border,
            borderWidth: ui.borders.width,
            borderRadius: ui.shape.radius,
          },
        ]}>
        <Text
          style={[
            styles.message,
            { color: ui.colors.textPrimary, fontSize: ui.typography.small },
          ]}>
          {activeBanner.message}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
    elevation: 3,
  },
  message: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
