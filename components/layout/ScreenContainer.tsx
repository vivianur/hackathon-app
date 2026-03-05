import React from 'react';
import { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { useAdaptiveTheme } from '@/hooks';

type ScreenContainerProps = {
  children: React.ReactNode;
  gap?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenContainer({ children, gap, contentContainerStyle }: ScreenContainerProps) {
  const { ui } = useAdaptiveTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        {
          width: '100%',
          maxWidth: ui.layout.maxContentWidth,
          alignSelf: 'center',
          padding: ui.spacing.lg,
          gap: gap ?? ui.spacing.md,
          backgroundColor: ui.colors.bg,
        },
        ui.layout.isTabletFrame && {
          marginBottom: 16,
          borderWidth: ui.borders.width,
          borderColor: ui.colors.border,
          borderBottomLeftRadius: ui.shape.radius + 4,
          borderBottomRightRadius: ui.shape.radius + 4,
          overflow: 'hidden',
        },
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  );
}
